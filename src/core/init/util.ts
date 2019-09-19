import { vueComponent, ComponentOptions } from "../../@types/vue";

export function initInternalComponent(
  vm: vueComponent,
  options: ComponentOptions
) {
  const opts = (vm.$options = Object.create((vm.constructor as any).options));
  const vnode = options._parentVnode;
  opts._parentVnode = vnode;
  const vnodeComponentOptions = vnode.componentOptions;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts.propsData = vnodeComponentOptions.propsData;
}
