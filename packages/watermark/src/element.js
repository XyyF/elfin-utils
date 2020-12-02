// const Observer from './observer'

export default class Watermark {
  constructor(options) {
    this.options = options || {text: ''};
    this.mount();
  }

  mount() {
    const waterWrapper = document.createElement('div');
    this.injectStyle(waterWrapper, {
      position: 'fixed',
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
    const { clientWidth, clientHeight } = document.documentElement || document.body;
    const column = Math.ceil(clientWidth / waterWidth);
    const rows = Math.ceil(clientHeight / waterHeight);
  
    for (let i = 0; i < column * rows; i++) {
      const wrap = document.createElement('div');
      this.injectStyle(wrap, {
        position: 'relative',
        width: `${waterWidth}px`,
        height: `${waterHeight}px`,
        flex: `0 0 ${waterWidth}px`,
        overflow: 'hidden',
      });
      wrap.appendChild(this.createItem());
      waterWrapper.appendChild(wrap);
    }
    document.body.appendChild(waterWrapper);
  }

  injectStyle(el, property) {
    for (let i in property) {
      if (property.hasOwnProperty(i)) {
        el.style[i] = property[i];
      }
    }
  }

  createItem() {
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
}