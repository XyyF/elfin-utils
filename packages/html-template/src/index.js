(function () {
  /**
   * @param {*} tpl 模板内容
   * @param {*} data 模板数据
   * @param {*} cache 是否缓存
   */
  function elfinTpl(tpl, data, cache = true) {
    var dataValue = [], fn;
    if (cache && cached[tpl]) {
      // 缓存
      for (var i = 0, d = cached[tpl].dataNames, j = d.length; i < j; i++) {
        dataValue.push(data[d[i]]);
      }
      fn = cached[tpl].fn;
    } else {
      var transStr = (function (str) {
        // 转换字符串
        // type 1 <%= 2 <%# 3 <%
        let type = '', result = '', tokens = '', strIndex = 0, totalIndex = str.length;
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
            // 逻辑
            clearToken();
            type = 3;
            strIndex += 3;
          } else if (preStr == '%>') {
            clearToken();
            strIndex += 2;
          } else {
            // 字符处理
            switch (str[strIndex]) {
              case "\\": // 转义
              case "'":
                tokens += '\\' + str[strIndex];
                break;
              case "\n": // 跳过
              case "\r":
              case "\t":
                break;
              default: // 其他字符
               tokens += str[strIndex];
            }
            strIndex++;
          }
        }

        function clearToken() {
          if (tokens == '') return;
          switch (type) {
            case 1:
              result = result + "s += " + tokens + ";\n ";
              break;
            case 2:
              result = result + "s += '<!-- " + tokens + " -->';\n ";
              break;
            case 3:
              result = result + tokens + '\n ';
              break;
            default:
              result = result + "s += '" + tokens + "';\n ";
          }
          tokens = '';
          type = '';
        }
        // 遗留token
        if (tokens) result += "s += '" + tokens + "';";
        return result;
      })(tpl);
      // 执行字符串
      var fnBody = "var s = '';\n " + transStr + ";\n return s;";
      var dataNames = [];
      for (var key in data) {
        dataNames.push(key);
        dataValue.push(data[key]);
      }
      fn = new Function(dataNames, fnBody);
      cache && (cached[tpl] = { dataNames, fn });
    }

    try {
      return fn.apply(e, dataValue);
    } catch (error) {
      // 错误代码调试
      var _variable = "elfinTpl" + Date.now()
        , _varString = "var " + _variable + "=" + fn.toString()
        , _head = document.getElementsByTagName("head")[0]
        , _script = document.createElement("script")
        , _ua = navigator.userAgent.toLowerCase();
      if (_ua.indexOf("gecko") > -1 && _ua.indexOf("khtml") == -1) {
        e.eval.call(e, _varString),
          e[_variable].apply(e, dataValue);
        return;
      }
      _script.innerHTML = _varString,
        _head.appendChild(_script),
        _head.removeChild(_script),
        e[_variable].apply(e, dataValue);
    }
  }

  var e = window, cached = {};

  typeof exports != "undefined" ? exports.elfinTpl = elfinTpl : e.elfinTpl = elfinTpl;
})();
