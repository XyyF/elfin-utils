## jsx-parse

### 1. 分析目标
```js
`<div name="{{jsx-parse}}" class="{{fuck}}" id="1">
  Life is too difficult
</div>`

==> 

[{
  type: 'div',
  props: {
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
<div> | <div ...props></div> | <div class="123" name={{a: 1}}></div> | <div />

/^\<(\w[\s\/\>]*)/
```



###

TODO

// - 3.10 解析jsx attrs
- 3.11 解析结束标签
- 3.12 解析注释标签
- 3.13 解析children
- 3.14 解析文本内容
- 3.15 jest测试方案
