const JsxParser = require('../main/index');

describe('jsx-parse', () => {
  describe('单节点', () => {
    test('正常场景', () => {
      const str = `<div></div>`;
      const res = JsxParser(str);
      expect(res).toEqual([
        {
          children: [],
          props: {},
          type: 'div',
        },
      ]);
    });
  });
});
