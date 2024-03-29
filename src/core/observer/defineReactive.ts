import { Dep } from "./dep";
import { getSharedPropertyDefinition } from "../../shared/utils";
import { observe } from "./observe";
import { noop } from "../../shared/utils/index";
import { watcherStack } from "./watcher";

let shouldObserveVal = true;
export const toggleObserving = _ => (shouldObserveVal = _);

function dependArray(value: Array<any>) {
  // 对数组的每一项都要做depend
  for (let i = 0; i < value.length; i++) {
    const item = value[i];
    // 这里是为$set的元素进行依赖收集
    // 正常为对象set可以，是因为进入了def，拿到了childOb
    // 但是如果为数组添加一个空对象，数组不会触发def和依赖收集，因此不会有childOb过程，需要手动把下面的依赖收集一通
    // this.$set(this.arr, "0", {});
    // this.$set(this.arr[0], "a", Math.random());
    if (item && item.__ob__) {
      item.__ob__.depForSet.depend();
    }
    if (Array.isArray(item)) {
      (item as any).__ob__.depForSet.depend();
      dependArray(item);
    }
  }
}

// 定义一个响应式属性
// 支持循环，对于对象，每一层有一个dep
export function defineReactive(obj: object, key: string | number, val?: any) {
  // 如果不可修改，不会添加
  const property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return;
  }
  // cater for pre-defined getter/setters
  const getter = property && property.get;
  const setter = property && property.set;
  // 首先，新建一个dep
  // dep的作用: 调度和通知，类似于处理中心
  const dep = new Dep();
  const sharedPropertyDefinition = getSharedPropertyDefinition();
  // 给val添加ob
  let childOb = shouldObserveVal && observe(val);

  // 在get的时候激活依赖收集
  sharedPropertyDefinition.get = function() {
    // 先计算值
    const value = (val = getter ? getter.call(obj) : val);
    // 关键是depend的位置
    dep.depend();

    if (childOb) {
      // 为子元素做好依赖，通知set的东西更新
      childOb.depForSet.depend();
      if (Array.isArray(value)) {
        // 这里是为了收集多维数组的依赖
        dependArray(value);
      }
    }
    return value;
  };
  sharedPropertyDefinition.set = function(newVal) {
    // 如果新旧值相等，退出
    if (newVal === val) {
      return;
    }
    if (setter) {
      setter.call(obj, newVal);
    }
    val = newVal;
    childOb = shouldObserveVal && observe(newVal);
    dep.notify();
  };
  Object.defineProperty(obj, key, sharedPropertyDefinition);
}

export function defineComputed(
  target: any,
  key: string,
  userDef: Object | Function
) {
  const sharedPropertyDefinition = getSharedPropertyDefinition();
  if (typeof userDef === "function") {
    sharedPropertyDefinition.get = function() {
      const watcher = this._computedWatchers && this._computedWatchers[key];
      if (watcher) {
        // 如果没有get过，get一把
        if (!watcher.isGet) {
          watcher.evaluate();
        }
        // watcher.computedDep.depend();
        // 如果是处于渲染watcher，那么要做依赖收集,将computed依赖的与渲染挂上钩
        if (watcherStack.getCurrentTarget()) {
          watcher.depend();
        }
        return watcher.value;
      }
    };
    sharedPropertyDefinition.set = noop;
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}
