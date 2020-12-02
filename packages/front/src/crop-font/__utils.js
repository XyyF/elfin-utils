const fs = require('fs');
const path = require('path');
const { fontCodeEnums } = require('../__config');

/**
 * 将文本字体转化为 Unicode 字体
 * @param {string} text
 */
function transText2Unicode(text) {
  if (!text) return '';

  const textArr = text.split('');
  const result = [];

  for (let i = 0, l = textArr.length; i < l; i++) {
    const text = textArr[i];
    if (text) {
      result.push(text.toString().charCodeAt());
    }
  }

  return result;
};

/**
 * 获取字体文件路径 && 校验信息
 * @param {number} options.fontCode 字体代码
 * @param {string} options.fontPath 如果选择自定义字体，需要提供字体文件路径
 */
function getFontPath(options) {
  if (!options || (!options.fontCode && !options.fontPath)) {
    throw new Error('请选择字体类型');
  }

  if (options.fontCode) {
    const isValid = fontCodeEnums[options.fontCode];
    if (isValid !== true) {
      throw new Error('错误的fontCode');
    }
    return path.join(__dirname, `..${path.sep}..${path.sep}fonts/${options.fontCode}.ttf`);
  } else if (options.fontPath) {
    if (!fs.existsSync(options.fontPath)) {
      throw new Error('错误的fontPath，或者文件不存在');
    }
    return options.fontPath;
  }
};

module.exports = {
  getFontPath,
  transText2Unicode,
};
