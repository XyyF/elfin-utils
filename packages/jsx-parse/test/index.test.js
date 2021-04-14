const JsxParser = require('../main/index');
// const JsxParser = require('./reference');

describe('jsx-parse', () => {
  describe('单节点', () => {
    test('整体场景', () => {
      const str = `
        <div name={name} className="class-name">
          inline text{a}
        </div>
      `;
      const res = JsxParser(str);
      expect(res).toEqual([
        {
          type: 'div',
          props: {
            className: 'class-name',
            name: { type: '#jsx', nodeValue: 'name' },
          },
          children: [
            { type: '#text', nodeValue: 'inline text' },
          ],
        },
      ]);
    });

    test('普通属性', () => {
      const str = `<div className="class-name"></div>`;
      const res = JsxParser(str);
      expect(res).toEqual([
        {
          children: [],
          props: {
            className: 'class-name',
          },
          type: 'div',
        },
      ]);
    });

    test('jsx属性', () => {
      const str = `<div name={name}></div>`;
      const res = JsxParser(str);
      expect(res).toEqual([
        {
          children: [],
          props: {
            name: { type: '#jsx', nodeValue: 'name' },
          },
          type: 'div',
        },
      ]);
    });
  });
});
