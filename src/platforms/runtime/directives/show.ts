import { IVNode, IVNodeDirective } from "../../../@types/vnode";

function locateNode(vnode: IVNode) {
  return vnode.isComponent ? locateNode(vnode.componentInstance._vnode) : vnode;
}

export default {
  bind(el: any, { value }: IVNodeDirective, vnode: IVNode) {
    // 需要找到真正的节点而不是组件节点
    // vnode = locateNode(vnode);
    const originalDisplay = (el.__vOriginalDisplay =
      el.style.display === "none" ? "" : el.style.display);
    el.style.display = value ? originalDisplay : "none";
  },
  update(el: any, { value, oldValue }: IVNodeDirective, vnode: IVNode) {
    if (!value === !oldValue) return;
    el.style.display = value ? el.__vOriginalDisplay : "none";
  },
  unbind(
    el: any,
    binding: IVNodeDirective,
    vnode: IVNode,
    oldVnode: IVNode,
    isDestroy: boolean
  ) {
    if (!isDestroy) {
      el.style.display = el.__vOriginalDisplay;
    }
  }
};
