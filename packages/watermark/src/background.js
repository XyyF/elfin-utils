import observer from './observer';

export default class Watermark {
  /**
   * @param {Object} options
   * @param {string?} options.img 水印图片路径
   * @param {Element?} options.el 水印挂载元素
   * @param {string?} options.observer 是否监听文本变动
   */
  constructor(options = {}) {
    this.options = options || {};
    this.options.el = options.el || document.body;
    if (!(this.options.el instanceof Element)) {
      throw new Error('错误的el，请确认后重新操作');
    }
    if (!(this.options.img)) {
      throw new Error('错误的img，请确认后重新操作');
    }
    this.observers = null;
  }

  mount() {
    const waterWrapper = this._createWrap();
    this.options.el.style.position = 'relative';
    this.options.el.prepend(waterWrapper);

    if (this.options.observer) {
      this.observers = observer.call(this, this.options.el, waterWrapper);
    }
    if (this.options.resize) {
      window.onresize = () => {
        this.unmount();
        this.mount();
      };
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

  _createWrap() {
    const waterWrapper = document.createElement('div');
    waterWrapper.id = 'elfin-watermark';
    this._injectStyle(waterWrapper, {
      width: '100%',
      height: '100%',
      'min-height': '28px',
      position: 'absolute',
      top: 0,
      left: 0,
      'z-index': 1,
      opacity: 0.2,
      'pointer-events': 'none',
      'background-repeat': 'repeat',
      'background-image': `url("${this.options.img}")`,
    });

    return waterWrapper;
  }
}
