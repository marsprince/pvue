import { Vue } from "../index";
import { proxyMethods } from "../instance/proxy";
import { warn } from "../../shared/log";
import { hasOwn } from "../../shared/utils";
import { proxy } from "../instance/proxy";
import { observe } from "../observer/observe";

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
