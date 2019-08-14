import { defineReactive } from "./index";

export function set(target: object, key: string, val: any) {
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
