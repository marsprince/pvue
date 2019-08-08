import { createTextVNode } from "../vdom/vnode";

export function installRenderHelpers(target: any) {
  target._c = target.$createElement;
  target._v = createTextVNode;
}
