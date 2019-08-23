import { defineReactive } from "./defineReactive";
import { Watcher } from "./watcher";
import { IWatcherOptions } from "../../@types/observer";
import { isPlainObject } from "../../shared/utils";
import { createWatcher } from "../init";

export function set(target: object, key: string | number, val: any) {
  // 如果是数组
  if (Array.isArray(target)) {
    target.length = Math.max(target.length, Number(key));
    target.splice(Number(key), 1, val);
    return val;
  }
  // 如果已经set过了,不能重新定义
  if (key in target) {
    target[key] = val;
    return val;
  }
  const ob = (target as any).__ob__;
  if (!ob) {
    target[key] = val;
    return val;
  }
  // 问题：这个时候依赖收集已经结束了，watcher栈也没有了，想depend也不行
  // 必须找到一个已经存在的dep，因为那个里面存着watcher
  // 我们只能拿到ob，因此考虑将ob和dep进行一对一关联，才能拿到一个dep
  // 每一层有一个ob，对应一个dep
  defineReactive(target, key, val);
  ob.depForSet.notify();
}

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
