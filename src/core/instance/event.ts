import { vueComponent } from "../../@types/vue";
import { updateListeners } from "../vdom/helpers/updateListeners";

function add(target, event, fn) {
  target.$on(event, fn);
}

function remove(target, event, fn) {
  target.$off(event, fn);
}

export function updateComponentListeners(
  vm: vueComponent,
  listeners: Object,
  oldListeners?: Object
) {
  updateListeners(vm, listeners, oldListeners || {}, add, remove);
}
