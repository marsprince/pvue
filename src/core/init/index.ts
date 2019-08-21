import { Vue } from "../index";
import { proxyMethods } from "../instance/proxy";
import { warn } from "../../shared/log";
import { hasOwn, noop } from "../../shared/utils";
import { proxy } from "../instance/proxy";
import { observe } from "../observer/observe";
import { ComputedWatcher } from "../observer/watcher";
import { defineComputed } from "../observer/defineReactive";

export function initMethods(vm: Vue) {
  if (vm.$options.methods) proxyMethods(vm);
}

function getData(data: Function, vm: Vue) {
  return data.call(vm);
}

export function initData(vm: Vue) {
  let data = vm.$options.data;

  if (data) {
    // 首先得是个函数
    if (typeof data === "function") {
      data = getData(data, vm);
    } else {
      warn("data must be a function");
    }
  }
  // 这里会判断data和props,methods不能重复，不写了
  vm._data = data || {};
  // 将_data挂到vm上
  for (let key in data) {
    if (hasOwn(data, key)) {
      proxy(vm, "_data", key);
    }
  }

  // observe
  observe(data);
}

export function initComputed(vm: Vue) {
  // computed支持两种方式，函数和包含get和set的对象
  const { computed } = vm.$options;
  if (computed) {
    const watchers = (vm._computedWatchers = Object.create(null));
    for (const key in computed) {
      const userDef = computed[key];
      const getter = typeof userDef === "function" ? userDef : userDef.get;
      // 创建一个新的watcher
      // 这个watcher有什么不同？
      // 不会立即触发get函数，只有在依赖收集触发get的时候触发
      watchers[key] = new ComputedWatcher(vm, getter || noop);
      if (!(key in vm)) {
        defineComputed(vm, key, userDef);
      }
    }
  }
}
