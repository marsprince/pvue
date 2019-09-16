import { createTextVNode } from "./vdom/vnode";
import { toString } from "../shared/utils";
import { resolveFilter } from "./instance/renderHelper";

export function installRenderHelpers(target: any) {
  target._c = target.$createElement;
  target._m = target.renderStatic;
  target._v = createTextVNode;
  target._s = toString;
  target._f = resolveFilter;
}
