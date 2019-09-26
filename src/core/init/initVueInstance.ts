import { Vue } from "../index";
import { proxyMethods } from "../instance/proxy";
import { warn } from "../../shared/log";
import { hasOwn, noop, isPlainObject } from "../../shared/utils";
import { proxy } from "../instance/proxy";
import { observe } from "../observer/observe";
import { ComputedWatcher } from "../observer/watcher";
import { defineComputed } from "../observer/defineReactive";
import { IWatcherOptions } from "../../@types/observer";
import { vueComponent } from "../../@types/vue";
import { updateComponentListeners } from "../instance/event";
import { toggleObserving, defineReactive } from "../observer/defineReactive";
import { resolveSlots } from "../instance/renderHelper";
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
  Object.defineProperty(vm, "$data", {
    get() {
      return this._data;
    }
  });
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

export function createWatcher(
  vm: Vue,
  expOrFn: string | Function,
  handler: any,
  options: IWatcherOptions = {}
) {
  // 如果是个对象，则作为options
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  // handler也可以是字符串
  if (typeof handler === "string") {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options);
}

export function initWatch(vm: Vue) {
  const { watch } = vm.$options;
  for (let key in watch) {
    const handler = watch[key];
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

// 初始化vue自身的events,和输入无关
export function initVueEvents(vm: vueComponent) {
  const listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

// props如果是基本类型，可以直接改，这时候调用的是依然dr
export function initProps(vm: vueComponent) {
  // props: 定义
  // propsData：数据
  const { props, propsData } = vm.$options;
  const { _props } = vm;
  const isRoot = false;
  if (!isRoot) {
    toggleObserving(false);
  }
  for (const key in props) {
    // TODO: 验证
    const value = propsData[key];
    defineReactive(_props, key, value);
    if (!(key in vm)) {
      proxy(vm, `_props`, key);
    }
  }
  toggleObserving(true);
}

export function initLifecycle(vm: vueComponent) {
  // 初始化父子组件关系，主要是当前组件的$parent和父组件的$children
  const options = vm.$options;

  // locate first non-abstract parent
  let parent = options.parent;
  // 如果当前组件不是抽象组件，则将当前组件推入父组件的children中
  if (parent && !options.abstract) {
    // 如果父组件是一个抽象组件，则递归查找
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }
  vm.$parent = parent;
}

export function initRender(vm: vueComponent) {
  const options = vm.$options;
  const parentVnode = (vm.$vnode = options._parentVnode); // the placeholder node in parent tree
  const renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  if (parentVnode) {
    vm.$scopedSlots = parentVnode.data.scopedSlots || {};
  }
}
