import { vueComponent } from "../../@types/vue";
import { invokeWithErrorHandling } from "../util/error";
import { lifeCycle } from "../../shared/constant";
import { Watcher } from "../../core/observer/watcher";
import { createEmptyVNode } from "../vdom/vnode";

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
