# 背景介绍

在 Web 中，使用合适的字体能带来良好的体验，但是其中同样存在一定的风险：

- 字体文件体积过大，可能导致预览时间过长，下方表格是 [中文-英文]字体的对比
  不像英文字体(26个英文字母+数字)，中文字体存在大量的文字内容 && 中文字形远比字母复杂的多，导致字体文件内容过大;
  然而在真实使用过程中，可能只会用到特定的文字，大部分文字并没有用到;
- 在字体文件加载完成前，不会展示预览内容

| 字体名称  | 字形数量 | 字形所占字节数 |
| ------------- | ------------- | ------------- |
| FZQingFSJW_Cu.ttf | 8731 | 4762272 |
| JDZhengHT-Bold.ttf | 122 | 18328 | 

# 字体文件的使用

通过@font-face指定字体文件的url 和 并赋予字体名字;

> url不仅仅可以指定为字体文件的 cdn地址，还可以通过后端返回 buffer数据流，让浏览器来完成字体的加载工作

```css
@font-face {
    font-family: "elfinFont"; /* 名字任意取 */
    src: url("webfont.woff2") format("woff2"),
         url("webfont.woff") format("woff"),
         url("webfont.ttf") format("truetype");
    font-style:normal;
    font-weight:normal;
}

.font {
  font-family: 'elfinFont';
}
```

# 参考
[Web 中文字体处理总结](https://aotu.io/notes/2020/02/28/webfont-processing/index.html)