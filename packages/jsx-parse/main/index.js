const TagConst = {
  Comment: '#comment',
  Text: '#text',
  Jsx: '#jsx',
};

// 匹配空格、换行符
const invalidRegexp = /^\s*$/;

/**
 * jsx解析器
 */
module.exports = function JsxParser(string) {
  return new Lexer(string).lex();
};

class Lexer {
  constructor(string) {
    this.string = string;
  }

  lex() {
    // 在顶层预留虚拟vdom节点，包裹整个真实VDOM
    const topVdom = { children: [] };
    // 初始化stack栈
    const stack = [topVdom];

    /**
     * 当遇到起始标签时，将节点入栈
     * 当遇到结束标签时，出栈节点
     * tips: 在起始标签 ～ 结束标签之间，解析到的新节点都是children
     * @param {*} vdom
     */
    function pushChildrenNode(vdom) {
      const lastDom = stack[stack.length - 1];
      if (lastDom) {
        lastDom.children.push(vdom);
      }
    }

    /**
     * 开始遍历jsx解析
     * 这里使用while循环，而不是for循环，因为while循环可以让this.string可改变，更加灵活
     */
    while (this.string && this.string.length > 0) {
      /**
       * 有大到小进行解析，如果是 < 字符，那么有可能 </、<!--、<div ...
       * 所以由大范围匹配往小范围进行解析
       */
      // 处理结束标签 </
      if (this.string.indexOf('</') === 0) {
        const token = this.matchEndTag();
        if (token) {
          // 如果此时没有字符了，代表遍历已经结束
          // if (this.string.length === 0) return topVdom.children;
          // 当前 tag 已经闭合，将stack中的标签出栈
          const stackNode = stack.pop();
          // 校验 如果闭合标签tagName不匹配，报错
          if (stackNode.tagName !== token.tagName) {
            throw new Error('错误的闭合标签');
          }
          continue;
        }
      }

      // 处理注释标签 <!--
      if (this.string.indexOf('<!--') === 0) {
        const token = this.matchComment();
        if (token) {
          pushChildrenNode(token);
          continue;
        }
      }

      // 处理起始标签 <
      if (this.string.indexOf('<') === 0) {
        const token = this.matchStartTag();
        if (token) {
          pushChildrenNode(token);
          stack.push(token);
          continue;
        }
      }

      // 处理文本标签
      const token = this.matchText();
      if (token) {
        pushChildrenNode(token);
      }
    }

    return topVdom.children;
  }

  /**
   * 处理元素节点 <
   */
  matchStartTag() {
    // 解析tagName: <div props...> | <div></div> | <div/>
    const match = this.string.match(/<(\w[^\s/>]*)/);
    if (match) {
      const tagName = match[1];
      const node = {
        type: tagName,
        props: {},
        children: [],
      };

      this.string = this.string.replace(match[0], '');
      const [str, props] = this.parseTagAttr();
      node.props = props;
      this.string = str;

      return node;
    }
    throw new Error('错误的符号: <');
  }

  /**
   * 处理结束节点 </
   */
  matchEndTag() {
    const match = this.string.match(/<\/(\w+)>/);
    if (match) {
      const tagName = match[1];
      const node = {
        type: tagName,
        props: {},
        children: [],
      };

      this.string = this.string.replace(match[0], '');

      return node;
    }
    throw new Error('错误的符号: </');
  }

  /**
   * 解析文本内容
   * tips: 在jsx中，不推荐直接在元素内容中书写 <、> 等符号，可以放入字符串变量中
   */
  matchText() {
    const index = this.string.indexOf('<');
    const sIndex = this.string.indexOf('{');
    const eIndex = this.string.indexOf('}');

    // 文本内容，正常文本内容不应包含【<、{、}】标签，会被识别；
    // 如果想要使用这类标签，应该通过 {} 进行渲染；
    if (sIndex < eIndex && (index === -1 || sIndex < index)) {
      let text = '';
      // 处理jsx
      text += this.string.slice(0, sIndex);
      text += this.string.slice(sIndex + 1, eIndex);
      this.string = this.string.slice(eIndex + 1);
      return {
        type: TagConst.Text,
        nodeValue: text,
      };
    }
    if (index > -1) {
      const nodeValue = this.string.slice(0, index);
      if (nodeValue.length > 0) {
        this.string = this.string.slice(index);
        return {
          type: TagConst.Text,
          nodeValue,
        };
      }
      throw new Error('错误的符号: <');
    }
    // 纯文本
    const nodeValue = this.string;
    this.string = '';
    return {
      type: TagConst.Text,
      nodeValue,
    };
  }

  /**
   * 解析注释节点 <!--
   */
  matchComment() {
    const match = this.string.match(/<!--\w+>/);
    if (match) {
      const node = {
        type: TagConst.Comment,
        nodeValue: match[0],
      };

      this.string = this.string.replace(match[0], '');

      return node;
    }
    return null;
  }

  /**
   * 解析元素节点的attr值，当匹配 / 或 > 结束
   * <div attr="xxx"></div> | <div attr={xxx}/>
   *
   * 词法：
   * attrName attr属性名
   * attrValue attr属性值
   * equal =符号（前置：attrName必须有值）
   * quote "|'符号（前置：attrName必须有值）
   * jsx {符号（前置：attrName必须有值）
   * inlineJsx {...a} 内联jsx属性
   */
  parseTagAttr() {
    let state = 'attrName',
      attrName = '',
      attrValue = '',
      // 匹配jsx时，闭合标签需要完全匹配
      closureIndex = 0;
    const props = {};
    for (let i = 0, l = this.string.length; i < l; i++) {
      const word = this.string[i];
      switch (state) {
        case 'attrName':
          if (word === '/' || word === '>') {
            return [this.string.slice(i + 1), props];
          }
          if (invalidRegexp.test(word)) {
            if (attrName) {
              props[attrName] = true;
              attrName = '';
            }
            break;
          } else if (word === '=') {
            if (!attrName) {
              throw new Error('需要指定attrName');
            }
            state = 'equal';
          } else if (word === '{') {
            i += 3;
            closureIndex++;
            state = 'inlineJsx';
          } else {
            attrName += word;
          }
          break;
        case 'equal':
          if (word === '"' || word === "'") {
            state = 'quote';
          } else if (word === '{') {
            closureIndex++;
            state = 'jsx';
          }
          break;
        case 'quote':
          if (word === '"' || word === "'") {
            props[attrName] = attrValue;
            attrValue = '';
            attrName = '';
            state = 'attrName';
          } else {
            attrValue += word;
          }
          break;
        case 'inlineJsx':
        // * 解析jsx内容，string不包含第一个{
        // * {...a}
        case 'jsx':
          // * 解析jsx内容，string不包含第一个{
          // * {a}
          // * {{a: "1"}}
          // * {{a: b > 1 ? '1' : '2'}}
          // * {() => this.bindxxx()}
          // * {() => {xxx}}
          // TODO 更加详尽的解析
          if (word === '{') {
            closureIndex++;
          }
          if (word === '}') {
            closureIndex--;
            if (closureIndex === 0) {
              if (state === 'inlineJsx' && props.inlineJsx) {
                props.inlineJsx.push({ type: TagConst.Jsx, nodeValue: attrValue });
              } else if (state === 'inlineJsx') {
                props.inlineJsx = [{ type: TagConst.Jsx, nodeValue: attrValue }];
              } else {
                props[attrName] = { type: TagConst.Jsx, nodeValue: attrValue };
              }
              attrValue = '';
              attrName = '';
              state = 'attrName';
              break;
            }
          }
          attrValue += word;
          break;
      }
    }
    throw new Error('需要闭合标签');
  }
}
