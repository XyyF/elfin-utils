const JsxParser = require('../main/index');

// const str = `<div name="{{jsx-parse}}" class="{{fuck}}" id="1">
//   Life is too difficult
//   <span name="life" like="rape">
//     <p>Life is like rape</p>
//   </span>
//   <div>
//     <span name="live" do="{{gofuck}}">
//       <p>Looking away, everything is sad </p>
//     </span>
//     <Counter me="excellent">I am awesome</Counter>
//   </div>
// </div>`
const str = `<div></div>`

const jsx = new JsxParser();
console.log(222, jsx.parse(str))