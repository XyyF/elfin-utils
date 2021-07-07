(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f():typeof define==='function'&&define.amd?define(f):(g=typeof globalThis!=='undefined'?globalThis:g||self,g.Watermark=f());}(this,(function(){'use strict';function observer(targetNode, waterNode) {
  let targetObserver, waterObserver;

  observerTarget.call(this);
  observerWater.call(this);

  function observerTarget() {
    // 创建一个观察器实例并传入回调函数
    targetObserver = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        for (const node of mutation.removedNodes) {
          if (node === waterNode) {
            targetNode.prepend(waterNode);
            return;
          }
        }
      }
    });
    // 以上述配置开始观察目标节点
    targetObserver.observe(targetNode, { childList: true });
  }

  function observerWater() {
    // 创建一个观察器实例并传入回调函数
    waterObserver = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        // 水印图层css样式被修改
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          this.unmount();
          this.mount();
          return;
        }
        // 子节点被删除
        if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
          this.unmount();
          this.mount();
          return;
        }
      }
    });
    // 以上述配置开始观察目标节点
    waterObserver.observe(waterNode, { attributes: true, childList: true, subtree: true });
  }

  return {
    targetObserver,
    waterObserver,
    disconnect() {
      targetObserver.disconnect();
      targetObserver = null;
      waterObserver.disconnect();
      waterObserver = null;
    },
  };
}class Watermark {
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

  _createItem() {
    const item = document.createElement('div');
    item.appendChild(document.createTextNode(this.options.text));
    this._injectStyle(item, {
      position: 'absolute',
      top: '0',
      left: '0',
      fontSize: '24px',
      color: 'rgb(201, 201, 201)',
      lineHeight: 1.5,
      opacity: 0.2,
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

    const waterHeight = 180;
    const waterWidth = 180;
    const heightSpace = 100;
    const widthSpace = 100;
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
}return Watermark;})));