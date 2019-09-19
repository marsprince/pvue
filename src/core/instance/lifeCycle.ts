import { vueComponent } from "../../@types/vue";
import { invokeWithErrorHandling } from "../util/error";
import { lifeCycle } from "../../shared/constant";
import { Watcher } from "../../core/observer/watcher";
import { createEmptyVNode } from "../vdom/vnode";
import { IVNode } from "../../@types/vnode";
import { toggleObserving } from "../observer/defineReactive";

export function callHook(vm: vueComponent, hook: string) {
  if (hook in lifeCycle) {
    const handlers = vm.$options[hook];
    const info = `${hook} hook`;
    if (handlers) {
      for (let i = 0, j = handlers.length; i < j; i++) {
        invokeWithErrorHandling(handlers[i], vm, null, vm, info);
      }
    }
  }
}

export function mountComponent(
  el?: Element,
  hydrating?: boolean
): vueComponent {
  this.$el = el;
  if (!this.$options.render) {
    this.$options.render = createEmptyVNode;
  }
  callHook(this, "beforeMount");
  // 渲染
  // 增加watcher
  const renderWatcher = new Watcher(this, () => {
    this._update(this._render());
  });
  renderWatcher.isRenderWatcher = true;
  this._watcher = renderWatcher;

  callHook(this, "mounted");
  return this;
}

export function updateChildComponent(vnode: IVNode) {
  const vm = vnode.componentInstance;
  const { propsData } = vnode.componentOptions;
  const { props } = vm.$options;

  vm.$options._parentVnode = vnode;
  vm.$vnode = vnode; // update vm's placeholder node without re-render

  if (vm._vnode) {
    // update child tree's parent
    vm._vnode.parent = vnode;
  }

  if (propsData && props) {
    toggleObserving(false);
    const props = vm._props;
    // vue使用了_propKeys来存储props的key值
    // const propKeys = vm.$options._propKeys || [];
    for (let key in props) {
      // const key = propKeys[i];
      // TODO: validate
      props[key] = propsData[key];
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }
}
