let Lexer = require('./parse');

class Jsx {
  constructor(type, props) {
    this.type = type;
    this.props = props;
  }
}

class JsxParser {
  constructor(string) {
    this.lexer = new Lexer(string);
    this.tokens = this.lexer.token;
    this.tags = [];
    this.jsx = {};
    this.currentJsx = this.jsx;
    this.setup();
  }

  setup() {
    let self = this;
    this.parseMap = {
      startTag: this.parseStart.bind(self),
      endTag: this.parseEnd.bind(self),
      text: this.parseText.bind(self),
      eof: this.parseEof.bind(self),
      error: this.parseErr.bind(self),
    };
  }

  parse() {
    this.currentToken = this.lexer.lex();
    let type = this.currentToken[0];
    let tag = this.currentToken[1];
    let props = this.mergeObj(this.currentToken[2]);
    let func = this.parseMap[type];
    if (func != undefined) {
      func(tag, props);
    } else {
      this.parseMap['error']();
    }

    if (this.tags.length > 0) {
      throw new Error('parse error! Mismatched start and end tags');
    }

    return this.jsx;
  }

  parseStart(tag, props) {
    let len = this.tags.length;
    let jsx = this.jsx;
    if (len >= 1) {
      for (let i = 0; i < len; i++) {
        if (len >= 2 && i >= 1) {
          jsx = jsx[jsx.length - 1]['props']['childrens'];
        } else {
          jsx = jsx.props['childrens'];
        }
      }
      this.currentJsx = new Jsx(tag, {
        childrens: [],
      });
      Object.assign(this.currentJsx['props'], props);
      jsx.push(this.currentJsx);
    } else {
      this.currentJsx = jsx = new Jsx(tag, {
        childrens: [],
      });
      Object.assign(jsx['props'], props);
      this.jsx = jsx;
    }
    this.tags.push(tag);
    this.parse();
  }

  parseEnd(tag) {
    if (tag == this.tags[this.tags.length - 1]) {
      this.tags.pop();
    }
    this.parse();
  }

  parseText(tag) {
    this.currentJsx['props']['text'] = tag;
    this.parse();
  }

  parseEof() {
    return;
  }

  parseErr() {
    throw new Error(`parse err! syntax err `);
  }

  mergeObj(objs) {
    let o = {};
    for (let i = 0; i < objs.length; i++) {
      Object.assign(o, objs[i]);
    }

    return o;
  }
}

module.exports = JsxParser;

class Lexer {
  constructor(string) {
    this.token = token;
    this.string = string;
    this.pos = 0;
  }

  advance() {
    let str = this.string[this.pos];
    this.pos++;
    return str;
  }

  lookAhead() {
    let str = this.string[this.pos];
    let p = this.pos;
    while (str == ' ' || str == '\n') {
      p++;
      str = this.string[p];
    }
    return str;
  }

  lex() {
    let text = '';
    while (true) {
      let t = this.advance();
      let token = '';
      switch (t) {
        case '<':
          if (this.lookAhead() === '/') {
            token = this.handleEndTag();
          } else {
            token = this.handleStartTag();
          }
          break;
        case '\n':
          break;
        case ' ':
          if (text != '') {
            text += t;
          } else {
            break;
          }
        case undefined:
          if (this.pos >= this.string.length) {
            token = [this.token['eof'], 'eof', []];
          }
          break;
        default:
          text += t;
          token = this.handleTextTag(text);
          break;
      }
      this.string = this.string.slice(this.pos);
      this.pos = 0;
      if (token != '') {
        return token;
      }
    }
  }

  handleStartTag() {
    let idx = this.string.indexOf('>');
    if (idx == -1) {
      throw new Error('parse err! miss match ' > '');
    }
    let str = this.string.slice(this.pos, idx);
    let s = '';
    if (str.includes(' ')) {
      s = this.string.split(' ').filter((str) => {
        return str != '';
      })[0];
    } else {
      s = this.string.split('>')[0];
    }
    let type = s.slice(1);
    this.pos += type.length;
    let props = this.handlePropTag();
    this.advance();
    return [token.startTag, type, props];
  }

  handleEndTag() {
    this.advance();
    let idx = this.string.indexOf('>');
    let type = this.string.slice(this.pos, idx);
    this.pos += type.length;
    if (this.advance() != '>') {
      throw new Error('parse err! miss match ' > '');
    }
    return [token.endTag, type, []];
  }

  handlePropTag() {
    let idx = this.string.indexOf('>');
    if (idx == -1) {
      throw new Error('parse err! miss match ' > '');
    }
    let string = this.string.slice(this.pos, idx);
    let pm = [];
    if (string != ' ') {
      let props = string.split(' ');
      pm = props
        .filter((props) => {
          return props != '';
        })
        .map((prop) => {
          let kv = prop.split('=');
          let o = {};
          o[kv[0]] = this.trimQuotes(kv[1]);
          return o;
        });
      this.pos += string.length;
    }

    return pm;
  }

  handleTextTag(text) {
    let t = text.trim();
    if (this.lookAhead() == '<') {
      return [this.token['text'], t, []];
    } else {
      return '';
    }
  }

  trimQuotes(string) {
    let last = string.length - 1;
    let dq = string[0] == '"' && string[last] == '"';
    let iq = string[0] == "'" && string[last] == "'";
    if (dq || iq) {
      return string.slice(1, last);
    }

    throw new Error(`parse error! ${string} quotes miss matchs`);
  }
}
