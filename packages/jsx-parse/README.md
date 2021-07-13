## jsx-parse

[babel-jsx-parse](https://babeljs.io/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&corejs=3.6&spec=false&loose=false&code_lz=DwSwdgNuCmAEAu0Ae8g&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=true&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=env%2Creact%2Cstage-2&prettier=false&targets=&version=7.14.2&externalPlugins=)
### 1. 分析目标
```js
`<div {...props} loop name="{name}" className="div-class" id="1">
  Life is {<} too difficult
</div>`

==> 

[{
  type: 'div',
  props: {
    inlineJsx: [{type: '#jsx', nodeValue: 'props'}],
    loop: true,
    name: {type: '#jsx', nodeValue: 'name'},
    className: 'div-class',
    id: '1',
    ...
  },
  children: [
    {type: '#text', nodeValue: 'Life is <'},
    {type: '#text', nodeValue: ' too difficult'},
  ],
}]

==>

真实节点
```

## 解析节点
字符串jsx不同于babel解析，因为无法直接区分 '\<div\>\</div\>' 究竟是使用者想要渲染成纯文本还是标签解析，因此，在jsx-parse中：
- <、{、}符号如果要转义使用，通过{}包裹；

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


### 2.3 判断在哪一节点.children放入解析内容
假想用一个虚拟节点包裹了输入字符串，结合返回值为数组，那么我们需要返回的就是 vdom.children

那么这个问题就变为了：<b>找到当前内容是哪一个节点的children？</b>
```js
<vdom>
  `内容字符串`
</vdom>
```

TODO

// - 3.10 解析jsx attrs
// - 3.11 解析结束标签
- 3.12 解析注释标签
// - 3.13 解析children
- 3.14 解析文本内容
// - 3.15 jest测试方案
