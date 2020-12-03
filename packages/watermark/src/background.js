import observer from './observer';

export default class Watermark {
  constructor(options = {}) {
    this.options = options || {};
    this.options.el = options.el || document.body;
    if (!(this.options.el instanceof Element)) {
      throw new Error('错误的el，请确认后重新操作');
    }
    if (!(this.options.img)) {
      throw new Error('错误的img，请确认后重新操作');
    }
  }

  mount() {
    const watermark = document.createElement('div');
    watermark.id = 'elfin-watermark';
    this.injectStyle(watermark, {
      width: '100%',
      height: '100%',
      'min-height': '28px',
      position: 'absolute',
      top: 0,
      left: 0,
      'z-index': 1,
      opacity: 0.1,
      'pointer-events': 'none',
      'background-repeat': 'repeat',
      'background-image': `url("${this.options.img}")`,
    });

    this.options.el.style.position = 'relative';
    this.options.el.prepend(watermark);

    if (this.options.observer) {
      observer.call(this, this.options.el, watermark);
    }
  }

  injectStyle(el, property) {
    for (const i in property) {
      if (property.hasOwnProperty(i)) {
        el.style[i] = property[i];
      }
    }
  }
}
