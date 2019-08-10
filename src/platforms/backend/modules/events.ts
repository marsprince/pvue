import { IVNode } from "../../../@types/vnode";
import { isUndef } from "../../../shared/utils";
import { updateListeners } from "../../../core/vdom/helpers/updateListeners";
import elementOps from "../elementOps";

// 事件相关的钩子函数
export function updateDOMListeners(oldVnode: IVNode, vnode: IVNode) {
  // 如果两个事件都不存在，则直接返回
  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
    return;
  }
  // 初始化
  const on = vnode.data.on || {};
  const oldOn = oldVnode.data.on || {};
  // 将平台的独有事件传进去
  updateListeners(
    vnode.elm,
    on,
    oldOn,
    elementOps.addEventListeners,
    elementOps.removeEventListeners
  );
}
