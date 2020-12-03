import observer from './observer';

export default class Watermark {
  constructor(options = {}) {
    this.options = options || {text: ''};
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
    item.innerHTML = this.options.text;
    this.injectStyle(item, {
      position: 'absolute',
      top: `50px`,
      left: `50px`,
      fontSize: `16px`,
      color: '#000',
      lineHeight: 1.5,
      opacity: 0.1,
      transform: `rotate(-15deg)`,
      transformOrigin: '0 0',
      userSelect: 'none',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
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
      position: 'absolute',
      top: '0px',
      right: '0px ',
      bottom: '0px',
      left: '0px',
      overflow: 'hidden',
      display: 'flex',
      'flex-wrap': 'wrap',
      'pointer-events': 'none',
    });
    const waterHeight = 100;
    const waterWidth = 180;
    const { clientWidth, clientHeight } = this.options.el;
    const column = Math.ceil(clientWidth / waterWidth);
    const rows = Math.ceil(clientHeight / waterHeight);

    for (let i = 0; i < column * rows; i++) {
      const wrap = document.createElement('div');
      this._injectStyle(wrap, {
        position: 'relative',
        width: `${waterWidth}px`,
        height: `${waterHeight}px`,
        flex: `0 0 ${waterWidth}px`,
        overflow: 'hidden',
      });
      wrap.appendChild(this._createItem());
      waterWrapper.appendChild(wrap);
    }
    return waterWrapper;
  }
}
