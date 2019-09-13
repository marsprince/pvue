import { IVNode } from "../../@types/vnode";
import { isUndef, isDef } from "../../shared/utils";
import { Hooks } from "../../platforms/backend/modules/hooks.enum";
import VNode, { createUseLessVNode } from "../../core/vdom/vnode";

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
  initComponent(vnode: IVNode) {
    vnode.elm = vnode.componentInstance.$el;
  }
  createComponent(vnode: IVNode, parentElm?: Element): boolean {
    // 源码是用data判断的
    // 这里为了清晰加了一个变量
    if (vnode.isComponent) {
      const data = vnode.data;
      if (isDef(data.hook) && isDef(data.hook.init)) {
        data.hook.init(vnode);
      }
      if (vnode.componentInstance) {
        this.initComponent(vnode);
        this.insert(parentElm, vnode.elm);
      }
      return true;
    }
  }

  createElm(vnode?: IVNode, parentElm?: any) {
    // 如果是组件节点，直接return
    if (this.createComponent(vnode, parentElm)) {
      return;
    }
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
        this.invokeHooks(Hooks.Create, createUseLessVNode(), vnode);
      }
      this.insert(parentElm, vnode.elm);
    } else if (vnode.isComment) {
      vnode.elm = nodeOps.createComment(vnode.text);
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

  // 新建一个空节点，并设置这个节点的elm唯传入的真实Dom
  emptyNodeAt(elm: Element) {
    let node = new VNode(this.nodeOps.tagName(elm).toLowerCase(), {}, []);
    node.elm = elm;
    return node;
  }

  patch(oldVnode: IVNode | Element, vnode: IVNode) {
    // 如果新节点存在且老节点不存在
    if (isUndef(oldVnode)) {
      // 如果老节点不存在
      this.createElm(vnode);
    } else {
      // 检查是否是真实dom节点
      const isRealElement = !(oldVnode instanceof VNode);
      // 两个都存在，并且是相同节点
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // 进入节点的patch流程
        this.patchVnode(oldVnode as IVNode, vnode);
      } else {
        // 如果是真实节点
        if (isRealElement) {
          oldVnode = this.emptyNodeAt(oldVnode as Element);
        }
        // 如果不是相同节点，走新建流程
        const oldElm = (oldVnode as IVNode).elm;
        const parentElm = this.nodeOps.parentNode(oldElm);
        this.createElm(vnode, parentElm);
      }
    }
    return vnode.elm;
  }
}
