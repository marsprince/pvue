import { callHook } from "../instance/lifeCycle";
import { remove } from "../../shared/utils";

export function destroy() {
  const vm = this;
  if (vm._isBeingDestroyed) {
    return;
  }
  callHook(vm, "beforeDestroy");
  vm._isBeingDestroyed = true;
  // 如果父组件不是删除中，则从父组件中删除自己
  const parent = vm.$parent;
  if (parent && !parent._isBeingDestroyed) {
    remove(parent.$children, vm);
  }
  // teardown watchers
  if (vm._watcher) {
    vm._watcher.teardown();
  }
  let i = vm._watchers.length;
  while (i--) {
    vm._watchers[i].teardown();
  }
  vm._isDestroyed = true;
  // 第一个是老节点，第二个是新节点
  vm.__patch__(vm._vnode, null);
  callHook(vm, "destroyed");
  // turn off all instance listeners.
}
