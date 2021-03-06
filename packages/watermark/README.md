# watermark 前端网页添加水印方案

水印: 在文章、图片加上特定的文字或图案以防止别人随便盗用，保护创者版权的手段。

水印存在很多的形式，有些铺满内容、有些在角落中、有些随着时间四处移动，但大多区分为 明水印 + 暗水印，顾名思义，两者前者可见、后者不可见

## demo

```js
npm install
npm run build
运行 demo/element.html
```

## 水印的一般实现
通过在网页中新增一个图层，在图层中增加水印，最后**将图层覆盖在页面内容区域之上**

这时候就引入了一个问题，因为是覆盖在页面中，为了不影响页面其他元素的点击事件，需要注销图层的事件交互
```css
pointer-events: none;
```

## 明水印: div实现

根据挂载元素的clientWidth、clientHeight计算出，需要动态生成 180 * 100 的水印div数量，将其放入水印图层中

![](https://rengar-1253859411.cos.ap-chengdu.myqcloud.com/img/20201203101153.png)

缺点:
- 因为是动态生成 div元素，页面中可能存在大量的Element节点，比较耗费性能
- 因为是根据挂载元素计算，如果在页面伸缩导致元素尺寸改变时，水印之间的间距不会跟着改变
  (该问题可以通过监听window.onresize解决，但存在一定的性能消耗)

[相关代码](./src/element.js)

## 明水印: background实现

根据一张单水印图片，通过背景图background-repeat: repeat重复渲染

该方案解决了div实现中 div元素过多、页面伸缩 等问题

缺点:
- 水印图片需要提前准备，不能动态的设置其中的文字
  (该问题可以通过请求后台，在后台根据文本动态的生成水印解决)

![示例水印](https://rengar-1253859411.cos.ap-chengdu.myqcloud.com/img/20201202193442.png)

[相关代码](./src/background.js)

## 明水印: 人工对抗

从上述可以了解到，明水印大多都是在页面中增加图层元素，但是这种明文的元素，很容易在如 Chrome Devtools 中找到该元素并删除，这样水印的效果就消失了

对抗这种行为可以使用 MutationObserver 方法，通过监听挂载元素，观察:
- 水印图层是否被删除，通过监听挂在元素，判断removedNodes中是否存在水印图层
- 水印图层css属性是否被修改，通过监听水印图层，判断attributes是否被修改
- 水印图层子节点是否被删除，通过监听水印图层，判断childList是否被修改

当发现水印图层被修改后，解绑旧的水印，重新生成新的水印图层并挂载

```js
检测到人为修改 -> unmount -> mount
```

[相关代码](./src/observer.js)

破解对抗:
- 在Chrome Devtools中，设置-Debugger-Disabled JavaScript，禁用JavaScript后，将不会执行水印监听代码，可以直接删除水印
- 拷贝一份body节点，然后删去原body节点，因为监听挂载都在原body节点内，在拷贝body中删除节点不会触发监听
- 使用代理工具，在获取到html前，删去水印相关Js文件

## 暗水印