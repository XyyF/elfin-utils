## html-template 前端html模板解析引擎

在原生网页中，无需 React、Vue 等框架，将html模板解析为相应的节点元素；

理念基于 ejs 模板引擎，本质可以理解为一个字符串拼接工具；

功能：
- 支持数据交互（推荐将数据摊平降低复杂度；
- 支持基本语法；
- 缓存模板解析结果；
- 高效率，一次遍历完成输出；

常用标签：
- <% %> 流程控制标签 ==> 转化为逻辑判断
- <%= %> 输出标签（原文输出HTML标签）==> 转化为字符串累加
- <%# %> 注释标签

缺陷：
- 不可调试

性能测试：

### demo
```html
<div id="demo"></div>

<script id="demo_tpl" type="text/html">
  <% if (list.length > 0) { %>
    <% for (i = 0, l = list.length; i < l; i++) { %>
      <div class="img_item <%= list[i] %>">
        <%= list[i] %>
      </div>
    <% } %>
  <% } %>
</script>

<script src="./src/index.min.js"></script>
<script>
  let list = ['demo'];

  document.querySelector('#demo').innerHTML = elfinTpl(
    document.querySelector('#colorRange_tpl').innerHTML, { list }
  );
</script>
```

### 原理

text/html

模板解析