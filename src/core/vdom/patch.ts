import { IVNode } from "../../@types/vnode";
import { isUndef, isDef } from "../../shared/utils";
import { Hooks } from "../../platforms/backend/modules/hooks.enum";
import { createEmptyNode } from "../../core/vdom/vnode";

function sameVnode(a, b) {
  return (
    a.key === b.key &&
    (a.tag === b.tag &&
      a.isComment === b.isComment &&
      isDef(a.data) === isDef(b.data))
  );
}

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

  // 每一个相同节点都会进入
  patchVnode(oldVnode: IVNode, vnode: IVNode) {
    if (oldVnode === vnode) {
      return;
    }
    const nodeOps = this.nodeOps;
    const elm = (vnode.elm = oldVnode.elm);
    // 两个相同节点，涉及文本和child比较
    if (isUndef(vnode.text)) {
      const oldCh = oldVnode.children;
      const ch = vnode.children;
      // 如果新节点文本不存在，则设置为‘’
      if (isDef(oldCh) && isDef(ch)) this.updateChildren(elm, oldCh, ch);
    } else {
      // 简单的设置新节点的文本
      nodeOps.setTextContent(elm, vnode.text);
    }
  }

  // 比较子节点
  updateChildren(parentElm: Node, oldCh: Array<IVNode>, newCh: Array<IVNode>) {
    // 先写一个简单的
    for (let i = 0; i < oldCh.length; i++) {
      this.patchVnode(oldCh[i], newCh[i]);
    }
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
    // 如果新节点存在且老节点不存在
    //

    if (isUndef(oldVnode)) {
      // 如果老节点不存在
      this.createElm(vnode);
    } else {
      // 两个都存在，并且是相同节点
      if (sameVnode(oldVnode, vnode)) {
        // 进入节点的patch流程
        this.patchVnode(oldVnode, vnode);
      }
    }
    return vnode.elm;
  }
}