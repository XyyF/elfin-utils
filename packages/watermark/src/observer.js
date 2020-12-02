export default function observer(targetNode, waterNode, config) {
  // 观察器的配置
  const defaultConfig = { attributes: true, childList: true, subtree: true };
  // 变动时执行的回调函数
  const callback = function (mutationsList) {
    for (let mutation of mutationsList) {
      for (let node of mutation.removedNodes) {
        if (node === waterNode) {
          targetNode.appendChild(waterNode);
          return;
        }
      }
    }
  };
  // 创建一个观察器实例并传入回调函数
  const observer = new MutationObserver(callback.bind(this));
  // 以上述配置开始观察目标节点
  observer.observe(targetNode, Object.assign(defaultConfig, config));
}
