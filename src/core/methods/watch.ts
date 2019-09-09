import { Watcher } from "../observer/watcher";
import { IWatcherOptions } from "../../@types/observer";
import { isPlainObject } from "../../shared/utils";
import { createWatcher } from "../init/initVueInstance";

export function watch(
  expOrFn: string | Function,
  cb: any,
  options: IWatcherOptions = {}
) {
  // key可以是a.b.c，或者是一个func
  // cb可以是对象或者函数
  let watcher;
  if (isPlainObject(cb)) {
    return createWatcher(this, expOrFn, cb, options);
  } else {
    watcher = new Watcher(this, expOrFn, cb, options);
  }
  if (options.immediate) {
    cb.call(this, watcher.value);
  }
  return function() {
    watcher.teardown();
  };
}
