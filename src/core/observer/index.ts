import { Dep } from "./dep";
import { getSharedPropertyDefinition } from "../../shared/utils";
import { observe } from "./observe";

// 定义一个响应式属性
// 支持循环，对于对象，每一层有一个dep
export function defineReactive(obj: object, key: string, _val?: any) {
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
  let val = obj[key] === undefined ? _val : obj[key];
  let childOb = observe(val);

  // 在get的时候激活依赖收集
  sharedPropertyDefinition.get = function() {
    // 先计算值
    const value = (val = getter ? getter.call(obj) : val);
    // 关键是depend的位置
    dep.depend();

    if (childOb) {
      // 为$set做好依赖
      childOb.depForSet.depend();
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
    childOb = observe(newVal);
    dep.notify();
  };
  Object.defineProperty(obj, key, sharedPropertyDefinition);
}
