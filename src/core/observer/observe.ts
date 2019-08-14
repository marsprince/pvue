import { isObject, hasOwn, defineProperty } from "../../shared/utils";
import { defineReactive } from "./index";
import { Dep } from "./dep";

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
    } else {
      this.walk(data);
    }
  }

  walk(obj: any) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i]);
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
