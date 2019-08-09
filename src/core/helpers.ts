import { createTextVNode } from "../vdom/vnode";

export function installRenderHelpers(target: any) {
  target._c = target.$createElement;
  target._m = target.renderStatic;
  target._v = createTextVNode;
}
