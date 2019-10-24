import { createTextVNode } from "./vdom/vnode";
import { toString } from "../shared/utils";
import {
  resolveFilter,
  renderList,
  renderSlot,
  resolveScopedSlots
} from "./instance/renderHelper";

export function installRenderHelpers(target: any) {
  // target._c = target.$createElement
  target._m = target.renderStatic;
  target._v = createTextVNode;
  target._s = toString;
  target._f = resolveFilter;
  target._l = renderList;
  target._t = renderSlot;
  target._u = resolveScopedSlots;
}
