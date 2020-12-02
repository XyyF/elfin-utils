const fs = require('fs');
const Font = require('fonteditor-core').Font;
const { transText2Unicode, getFontPath } = require('./__utils');

module.exports = class CropFontAPI {
  /**
  * @param {number} options.fontCode 字体代码
  * @param {string} options.fontPath 如果选择自定义字体，需要提供字体文件路径
  */
  constructor(options) {
    this.fontCode = options.fontCode;
    this.fontPath = options.fontPath;
  }

  /**
  * @param {string} text 需要裁剪的文本内容
  */
  _crop2Buffer(text) {
    const subset = transText2Unicode(text);
    if (subset.length === 0) {
      throw new Error('请输入需要裁剪的字符');
    }
    const surePath = getFontPath({
      fontCode: this.fontCode,
      fontPath: this.fontPath,
    });

    const buffer = fs.readFileSync(surePath);

    const font = Font.create(buffer, {
      type: 'ttf', // support ttf, woff, woff2, eot, otf, svg
      subset, // only read `a`, `b` glyf
      hinting: false, // save font hinting
      compound2simple: false, // transform ttf compound glyf to simple
      inflate: null, // inflate function for woff
      combinePath: false, // for svg path
    });

    return font.write({
      type: 'ttf', // support ttf, woff, woff2, eot, svg
      hinting: true, // save font hinting
      deflate: null, // deflate function for woff
      support: { head: {}, hhea: {} } // for user to overwrite head.xMin, head.xMax, head.yMin, head.yMax, hhea etc.
    });
  }
};
