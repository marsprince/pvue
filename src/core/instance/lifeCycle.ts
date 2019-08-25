import { vueComponent } from "../../@types/vue";
import { invokeWithErrorHandling } from "../util/error";
import { lifeCycle } from "../../shared/constant";

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
