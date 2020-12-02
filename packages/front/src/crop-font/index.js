const fs = require('fs');
const path = require('path');
const CropFontAPI = require('./cropFontAPI');

module.exports = class CropFont extends CropFontAPI {
  /**
   * @param {number} options.fontCode 字体代码
   * @param {string} options.fontPath 如果选择自定义字体，需要提供字体文件路径
   */
  constructor(options) {
    super(options);
  }

  /**
   * @param {string} text 需要裁剪的文本内容
   */
  font2file(text) {
    const buffer = this._crop2Buffer(text);
    const filePath = path.resolve(process.cwd(), 'elfin-font.ttf');
    return fs.writeFileSync(filePath, buffer);
  }

  font2buffer(text) {
    return this._crop2Buffer(text);
  }
};
