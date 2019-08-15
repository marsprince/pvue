import { isObject, hasOwn, defineProperty } from "../../shared/utils";
import { defineReactive } from "./index";
import { Dep } from "./dep";
import { arrayBridgeProto } from "./array";

// 观察者
export class Observer {
  depForSet: Dep;
  childOb: Observer;
  constructor(data: object) {
    this.init(data);
    this.depForSet = new Dep();
  }

  init(data: object) {
    // 把ob挂上，但是不可枚举
    defineProperty(data, "__ob__", this, false);
    // 数组处理
    if (Array.isArray(data)) {
      // 这里要继承Proto
      Object.setPrototypeOf(data, arrayBridgeProto);
      // 这里为什么不waik？
      // 因为只有已定义的对象是响应式的，包括对象，如果你不写属性，都只能通过set方式来设置响应式
      // 数组理论上也可以通过walk，但是数组一般一开始都是空的，就是你劫持不到任何东西，没意义
      // 因此只能走set方法，所以不用walk
      this.observeArray(data);
    } else {
      this.walk(data);
    }
  }

  walk(obj: any) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i], obj[keys[i]]);
    }
  }

  observeArray(items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
// 这里是入口
export function observe(value: any): Observer | void {
  // 如果不是对象
  if (!isObject(value)) {
    return;
  }
  let ob: Observer;
  // 使用对象上的__ob__属性获得已创建的observer
  if (hasOwn(value, "__ob__") && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else {
    ob = new Observer(value);
  }
  return ob;
}
