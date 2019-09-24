import VNode from "../vnode";
import { remove, isUndef, isDef } from "../../../shared/utils";
import { createFnInvoker } from "../helpers";

// 每一个hook都会被添加一个wrapper，因为hook运行一次就会清除
export function mergeVNodeHook(def: object, hookKey: string, hook: Function) {
  // 这里合并的是data里的hook
  // 如果传入的是vnode，则取data.hook字段
  if (def instanceof VNode) {
    def = def.data.hook;
  }
  // 最后的函数
  let invoker;
  const oldHook = def[hookKey];

  function wrappedHook() {
    hook.apply(this, arguments);
    // important: remove merged hook to ensure it's called only once
    // and prevent memory leak
    remove(invoker.fns, wrappedHook);
  }

  if (isUndef(oldHook)) {
    // no existing hook
    // 如果老的不存在，相当于直接新建一个
    invoker = createFnInvoker([wrappedHook]);
  } else {
    /* istanbul ignore if */
    if (isDef(oldHook.fns) && oldHook.merged) {
      // already a merged invoker
      invoker = oldHook;
      invoker.fns.push(wrappedHook);
    } else {
      // existing plain hook
      invoker = createFnInvoker([oldHook, wrappedHook]);
    }
  }

  invoker.merged = true;
  def[hookKey] = invoker;
}
