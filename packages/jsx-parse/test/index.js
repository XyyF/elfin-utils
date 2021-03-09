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
// const str = `123<div test={a > 1 ? '123' : '321'} test2={...{a: 1}}>123<br/></div>`
const str = `<div test="1" test2="312"></div>`

console.log(222, JsxParser(str, true))