const TagConst = {
  Comment: '#comment',
};

/**
 * jsx解析器
 */
module.exports = function JsxParser(string) {
  return new Lexer(string).lex();
};

class Lexer {
  constructor(string) {
    this.string = string;
    this.pos = 0;
  }

  lex() {
    let tokens = [];
    // while (this.string && this.string.length > 0) {
    // 处理结束标签 </

    // 处理注释标签 <!--

    // 处理起始标签 <
    if (this.string.indexOf('<') === 0) {
      tokens.push(this.bindStartTag());
    }
    // }

    return tokens;
  }

  /**
   * 获取下一个字符
   */
  addvance() {
    return this.string[this.pos++];
  }

  /**
   * 处理元素节点 <
   */
  bindStartTag() {
    // 解析tagName: <div props...> | <div></div> | <div/>
    const match = this.string.match(/^\<(\w[^\s\/\>]*)/);
    if (match) {
      const tagName = match[1];
      const node = {
        type: tagName,
        props: {},
        children: [],
      };

      this.string = this.string.replace(match[0], '');
      const [str, props] = this.bindTagAttr();
      node.props = props;
      this.string = str;

      return node;
    }
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
   */
  bindTagAttr() {
    let state = 'attrName',
      attrName = '',
      attrValue = '',
      props = {};
    for (let i = 0, l = this.string.length; i < l; i++) {
      const word = this.string[i];
      switch (state) {
        case 'attrName':
          if (word === '/' || word === '>') {
            return [this.string.slice(0, i + 1), props];
          }
          if (word === ' ') {
            break;
          } else if (word === '=') {
            if (!attrName) {
              throw new Error('需要指定attrName');
            }
            state = 'equal';
          } else {
            attrName += word;
          }
          break;
        case 'equal':
          if (word === '"' || word === "'") {
            state = 'quote';
          } else if (word === '{') {
            state = 'jsx';
          }
          break;
        case 'quote':
          if (word === '"' || word === "'") {
            props[attrName] = attrValue;
            attrValue = attrName = '';
            state = 'attrName';
          } else {
            attrValue += word;
          }
          break;
        case 'jsx':
          // TODO 处理jsx数据
          break;
      }
    }
    throw new Error('需要闭合标签');
  }

  /**
   * 解析文本内容
   */
  bindTextTag(text) {
    this.pos += text.length;
    this.string = this.string.slice(text + 1);
    return ['textTag', text, []];
  }
}
