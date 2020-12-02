class Observer {
  constructor() { }

  observer(targetNode, config) {
    // 观察器的配置（需要观察什么变动）
    const defaultConfig = { attributes: true, childList: true, subtree: true };
    // 当观察到变动时执行的回调函数
    const callback = function (mutationsList, observer) {
      // Use traditional 'for loops' for IE 11
      for (let mutation of mutationsList) {
        mutation.removedNodes.forEach(function (item) {
          if (item === watermakr) {
            document.body.appendChild(watermakr);
          }
        });
      }
    };
    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver(callback);
    // 以上述配置开始观察目标节点
    observer.observe(targetNode, Object.assign(defaultConfig, config));
  }
}
