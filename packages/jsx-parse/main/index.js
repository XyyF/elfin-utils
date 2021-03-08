
/**
 * jsx解析器
 */
module.exports = class JsxParser {
  constructor() {
  }

  /**
   * 解析jsx字符串
   * @{string} string jsx字符串
   */
  parse(string) {
    return new Lexer(string).lex();
  }
};

class Lexer {
  constructor(string) {
    this.string = string;
    this.pos = 0;
  }

  lex() {
    let tokens = [], text = '';
    // while (this.string && this.string.length > 0) {
      const word = this.addvance();
      switch(word) {
        case '<':
          tokens.push(this.bindStartTag());
          break;
        case ' ':
          text += word;
          break;
        case '\n':
          break;
        default:
          text += word;
          // tokens.push(this.bindTextTag(text));
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
   * 解析元素开始字符 <
   */
  bindStartTag() {
    const index = this.string.indexOf('>');
    if (index === -1) {
      throw new Error('Lexer parse error: >');
    }
    const str = this.string.slice(this.pos, index);
    // 分割属性值
    const words = str.split(' ').filter((e) => {
      return e != '';
    });
    // 元素节点tag
    const tag = words[0];
    // 解析props
    const props = {};

    // 重置字符起点
    this.pos += str.length;
    this.string = this.string.slice(index + 1);

    return ['startTag', tag, props];
  }

  /**
   * 解析文本内容
   */
  bindTextTag(text) {
    this.pos += text.length;
    this.string = this.string.slice(text + 1);
    return ['textTag', text, []];
  }
};
