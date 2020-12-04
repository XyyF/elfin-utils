import observer from './observer';

export default class Watermark {
  /**
   * @param {Object} options
   * @param {string} options.text 水印文本
   * @param {Element?} options.el 水印挂载元素
   * @param {string?} options.observer 是否监听文本变动
   * @param {string?} options.resize 是否监听浏览器窗口变动
   */
  constructor(options = {}) {
    this.options = options || { text: '' };
    this.options.el = options.el || document.body;
    if (!(this.options.el instanceof Element)) {
      throw new Error('错误的el，请确认后重新操作');
    }
    this.observers = null;
  }

  mount() {
    const waterWrapper = this._createWrap();
    this.options.el.style.position = 'relative';
    this.options.el.prepend(waterWrapper);
    // 监听DOM变动
    if (this.options.observer) {
      this.observers = observer.call(this, this.options.el, waterWrapper);
    }
    if (this.options.resize) {
      window.onresize = () => {
        this.unmount();
        this.mount();
      }
    }
  }

  unmount() {
    // 取消监听
    if (this.options.observer) {
      this.observers.disconnect();
      this.observers = null;
    }
    const waterWrapper = document.querySelector('#elfin-watermark');
    this.options.el.removeChild(waterWrapper);
  }

  _injectStyle(el, property) {
    for (const i in property) {
      if (property.hasOwnProperty(i)) {
        el.style[i] = property[i];
      }
    }
  }

  _createItem() {
    const item = document.createElement('div');
    item.appendChild(document.createTextNode(this.options.text));
    this._injectStyle(item, {
      position: 'absolute',
      top: '0',
      left: '0',
      fontSize: '16px',
      color: 'rgb(201, 201, 201)',
      lineHeight: 1.5,
      opacity: 0.5,
      transform: `rotate(-35deg)`,
      transformOrigin: '0 0',
      userSelect: 'none',
      whiteSpace: 'nowrap',
      // overflow: 'hidden',
    });
    return item;
  }

  _createWrap() {
    const waterWrapper = document.createElement('div');
    waterWrapper.id = 'elfin-watermark';
    this._injectStyle(waterWrapper, {
      width: '100%',
      height: '100%',
      'min-height': '28px',
      position: 'relative',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      'pointer-events': 'none',
    });

    const waterHeight = 166;
    const waterWidth = 340;
    const heightSpace = 150;
    const widthSpace = 180;
    const heightPadding = 60;
    const widthPadding = 60;
    const { scrollWidth, scrollHeight } = this.options.el;
    let maxWidth = scrollWidth, maxHeight = scrollHeight;
    if (parseInt(this.options.el.style.width) && this.options.el.style.width.indexOf('%') == -1) {
			maxWidth = parseInt(wmTarget.style.width) - 20,
      maxHeight = parseInt(wmTarget.style.height) - 20;
		}
    const columns = Math.ceil((maxWidth - widthPadding) / (waterWidth + widthSpace));
    const rows = Math.ceil((maxHeight - heightPadding) / (waterHeight + heightSpace));

    let x, y;
    const itemNode = this._createItem();
    for (let i = 0; i < rows; i++) {
      y = widthPadding + (waterHeight + heightSpace) * i;
      for (let j = 0; j < columns; j++) {
        x = heightPadding + (waterWidth + widthSpace) * j;
        if (i > 0 || j > 0) {
          const node = itemNode.cloneNode(true);
          node.style.left = `${x}px`;
          node.style.top = `${y}px`;
          waterWrapper.appendChild(node);
        }
      }
    }
    return waterWrapper;
  }
}
