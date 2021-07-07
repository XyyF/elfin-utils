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
}return Watermark;})));