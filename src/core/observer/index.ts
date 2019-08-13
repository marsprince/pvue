import { Dep } from "./dep";
import { getSharedPropertyDefinition } from "../../shared/utils";

// 定义一个响应式属性
export function defineReactive(obj: object, key: string, val: any) {
  // 如果不可修改，不会添加
  const property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return;
  }
  // cater for pre-defined getter/setters
  const getter = property && property.get;
  const setter = property && property.set;
  // 首先，新建一个dep
  // dep的作用？ 调度和通知，类似于处理中心
  const dep = new Dep();
  const sharedPropertyDefinition = getSharedPropertyDefinition();

  // 在get的时候激活依赖收集
  sharedPropertyDefinition.get = function() {
    // 先计算值
    const value = (val = getter ? getter.call(obj) : val);
    dep.depend();
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
    dep.notify();
  };
  Object.defineProperty(obj, key, sharedPropertyDefinition);
}
