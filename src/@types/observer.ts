export interface IWatcherOptions {
  // 立即执行watch的回调
  immediate?: boolean;
  // 深层变化会通知根watcher
  deep?: boolean;
  // 是否同步更新
  sync?: boolean;
}
