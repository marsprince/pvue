import { IVNodeData, IVNode } from "../../../@types/vnode";
import { genClassForVnode } from "../../utils/class";
import { isUndef } from "../../../shared/utils";

export function updateClass(oldVnode: IVNode, vnode: IVNode) {
  const el = vnode.elm as any;
  const data: IVNodeData = vnode.data;
  const oldData: IVNodeData = oldVnode.data;
  if (
    isUndef(data.staticClass) &&
    isUndef(data.class) &&
    (isUndef(oldData) ||
      (isUndef(oldData.staticClass) && isUndef(oldData.class)))
  ) {
    return;
  }

  let cls = genClassForVnode(vnode);

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute("class", cls);
    el._prevClass = cls;
  }
}
