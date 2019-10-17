import { invokeWithErrorHandling } from "../../util/error";
import { isDef } from "../../../shared/utils";
import { IVNode } from "../../../@types/vnode";

export function createFnInvoker(
  fns: Function | Array<Function>,
  vm?: any
): Function {
  function invoker() {
    const fns = invoker.fns;
    if (Array.isArray(fns)) {
      const cloned = fns.slice();
      for (let i = 0; i < cloned.length; i++) {
        invokeWithErrorHandling(cloned[i], null, arguments, vm, `v-on handler`);
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, `v-on handler`);
    }
  }
  invoker.fns = fns;
  return invoker;
}

export function getFirstComponentChild(children?: Array<IVNode>): IVNode {
  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      const c = children[i];
      if (isDef(c) && isDef(c.isComponent)) {
        return c;
      }
    }
  }
}
