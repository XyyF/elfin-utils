(function () {
  /**
   * @param {*} tpl 模板内容
   * @param {*} data 模板数据
   * @param {*} cache 是否缓存
   */
  function elfinTpl(tpl, data, cache) {
    var dataValue = [];
    if (cache && cached[tpl]) {
      // 缓存
    } else {
      var transStr = (function(str) {
        // 转换字符串
        let type = '', result = '', token = '', strIndex = 0, totalIndex = str.length;
        while (strIndex < totalIndex) {
          // <%# %> 注释标签，不执行、不输出内容
          // <% %> '脚本' 标签，用于流程控制，无输出
          // <%= %> 输出数据到模板
          let preStr = str[strIndex] + str[strIndex + 1];
          if (preStr + str[strIndex + 2] == '<%=') {
            // 输出数据到模板
            clearToken();
            type = 1;
            strIndex += 3;
          } else if (preStr + str[strIndex + 2] == '<%#') {
            // 注释
            clearToken();
            type = 2;
            strIndex += 3;
          } else if (preStr == '<%') {
            clearToken();
            type = 3;
            strIndex += 2;
          } else if (preStr == '%>') {
            clearToken();
            strIndex += 2;
          } else if (str[strIndex] == '\n') {
            strIndex++;
          } else {
            token += str[strIndex];
            strIndex++;
          }
        }

        function clearToken() {
          switch(type) {
            case 1: 
              result = result + ";s += " + token + ";";
              break;
            case 2:
              result = result + ";s += `<!-- " + token + " -->;`";
              break;
            case 3:
              result = result + token;
              break;
            default:
              result = result + "s += `" + token + "`;";
          }
          token = '';
          type = '';
        }

        if (token) result += "s += `" + token + "`;";
        
        return result;
      })(tpl);
      var fnBody = "var s = '';" + transStr + ";return s;";
      var dataNames = [];
      for(var key in data) {
        dataNames.push(key);
        dataValue.push(data[key]);
      }
      var fn = new Function(dataNames, fnBody);
    }

    try {
      return fn.apply(e, dataValue);
    } catch (error) {
      console.log(11, error);
    }
  }

  var e = window, cached = {};

  typeof exports != "undefined" ? exports.elfinTpl = elfinTpl : e.elfinTpl = elfinTpl
})();
