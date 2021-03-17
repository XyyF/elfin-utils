## jsx-parse

### 1. 分析目标
```js
`<div {...props} name="{{jsx-parse}}" class="{{fuck}}" id="1">
  Life is too difficult
</div>`

==> 

[{
  type: 'div',
  props: {
    inlineJsx: {type: '#jsx', nodeValue: 'props'},
    name: {type: '#jsx', nodeValue: '{jsx-parse}'},
    class: {type: '#jsx', nodeValue: '{fuck}'},
    id: '1',
    ...
  },
  children: [
    {...},
  ],
}]

==>

真实节点
```

### 2.1 解析节点起始标签
当匹配到 \< 字符时，表明可能遇到节点了，那么就需要判断是否满足以下场景（可通过正则验证）：
```js
<div> | <div {...props}></div> | <div class="123" name={{a: 1}}></div> | <div />

/^\<(\w[\s\/\>]*)/ 正则匹配元素节点名
```

### 2.2 节点属性解析
针对以下节点属性场景进行词法分析
```js
attr="xxx"> | attr={xxx}> | {...props}>

词法：
* attrName attr属性名
* attrValue attr属性值
* equal =字符（前置：attrName必须有值），标明attrName遍历结束
* quote "|'字符（前置：attrName必须有值，在=字符之后匹配），标明attrValue开始或者结束
* jsx {字符（前置：attrName必须有值，在=字符之后匹配），标明jsx解析
* inlineJsx {...a} 内联jsx属性，在匹配attrName时，遇到{字符，标明内联jsx
```
解析节点属性的一个规律：
1. 在清除节点tag名后，如果有属性，最先匹配的一定是attrName（剔除空格、换行 \s）
2. inlineJsx是在匹配属性途中可能遇见
3. 当在匹配attrName时，遇见 \字符 或者 >字符，说明该节点的匹配已经结束


###

TODO

// - 3.10 解析jsx attrs
- 3.11 解析结束标签
- 3.12 解析注释标签
- 3.13 解析children
- 3.14 解析文本内容
- 3.15 jest测试方案
