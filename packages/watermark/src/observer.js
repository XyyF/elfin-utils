export default function observer(targetNode, waterNode) {
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
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
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
}
