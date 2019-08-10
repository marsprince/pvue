import { IVNode } from "../../@types/vnode";
import { isUndef, isDef } from "../../shared/utils";
import { Hooks } from "../backend/modules/hooks.enum";
import { createEmptyNode } from "../../core/vdom/vnode";

export class Patch {
  nodeOps: any;
  modules: any;
  constructor(public backend: any) {
    // 操作（生成新节点，替换节点等）
    this.nodeOps = backend.nodeOps;
    // 模块（包含特定hook等）
    this.modules = backend.modules;
  }

  invokeHooks(name: string, oldVnode: IVNode, vnode: IVNode) {
    // 挂在modules里的hooks
    const hooks = this.modules.hooks[name];
    for (let i = 0; i < hooks.length; i++) {
      hooks[i](oldVnode, vnode);
    }
  }

  createElm(vnode?: IVNode, parentElm?: any) {
    // TODO：如果是组件节点
    // 校验tag是否合法

    const nodeOps = this.nodeOps;
    // const modules = this.modules;

    const tag = vnode.tag;
    const children = vnode.children;

    if (isDef(tag)) {
      // 调用
      vnode.elm = nodeOps.createElement(tag, vnode);
      // 遍历子虚拟节点，递归调用 createElm
      this.createChildren(vnode, children);
      // 激活对应的hook
      if (isDef(vnode.data)) {
        this.invokeHooks(Hooks.Create, createEmptyNode(), vnode);
      }
      this.insert(parentElm, vnode.elm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      this.insert(parentElm, vnode.elm);
    }
    return vnode;
  }

  createChildren(vnode, children) {
    // 循环调用creatElm
    if (Array.isArray(children)) {
      for (let i = 0; i < children.length; i++) {
        this.createElm(children[i], vnode.elm);
      }
    }
  }

  // 既可以插入到父节点后面，也可以插入到某个节点前面
  insert(parent, elm, ref?: any) {
    // 如果父vnode存在
    if (isDef(parent)) {
      this.nodeOps.appendChild(parent, elm);
    }
  }

  patch(oldVnode: IVNode, vnode: IVNode) {
    if (isUndef(oldVnode)) {
      this.createElm(vnode);
    }
    return vnode.elm;
  }
}
