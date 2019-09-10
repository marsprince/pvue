export function forceUpdate() {
  // force update watcher
  this._watcher && this._watcher.update();
}
