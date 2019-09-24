import { IVNode } from "../../@types/vnode";
import { isUndef, isDef } from "../../shared/utils";
import { Hooks } from "./modules/hooks.enum";
import VNode, { createUseLessVNode } from "../../core/vdom/vnode";
import { invokeComponentHook } from "./createComponent";

export const emptyNode = createUseLessVNode();

function sameVnode(a, b) {
  return (
    a.key === b.key &&
    (a.tag === b.tag &&
      a.isComment === b.isComment &&
      isDef(a.data) === isDef(b.data))
  );
}

interface IPatchProgress {
  isInitialPatch: boolean;
  insertedVnodeQueue: Array<any>;
}

export class Patch {
  nodeOps: any;
  modules: any;
  // 保存每一个patch流程的环境变量
  patchStack: Array<IPatchProgress> = [];
  constructor(public backend: any) {
    // 操作（生成新节点，替换节点等）
    this.nodeOps = backend.nodeOps;
    // 模块（包含特定hook等）
    this.modules = backend.modules;
  }

  invokeCreateHooks(vnode: IVNode) {
    // 先激活公共钩子，再激活组件对应的钩子
    const cbs = this.modules.hook;
    const { insertedVnodeQueue } = this.patchStack[this.patchStack.length - 1];
    for (let i = 0; i < cbs.create.length; ++i) {
      cbs.create[i](emptyNode, vnode);
    }
    let i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (isDef(i.create)) i.create(emptyNode, vnode);
      if (isDef(i.insert)) insertedVnodeQueue.push(vnode);
    }
  }

  invokeInsertHook(vnode: IVNode) {
    const ctx = this.patchStack[this.patchStack.length - 1];
    if (ctx.isInitialPatch && isDef(vnode.parent)) {
      // vnode.parent.data.pendingInsert = queue;
    } else {
      const queue = ctx.insertedVnodeQueue;
      for (let i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  invokeUpdateHook(oldVnode: IVNode, vnode: IVNode) {
    const { data } = vnode;
    const cbs = this.modules.hook;
    if (isDef(data)) {
      for (let i = 0; i < cbs.update.length; ++i) {
        cbs.update[i](oldVnode, vnode);
      }
      if (data.hook && data.hook.update) {
        data.hook.update(oldVnode, vnode);
      }
    }
  }

  initComponent(vnode: IVNode) {
    vnode.elm = vnode.componentInstance.$el;
  }
  createComponent(vnode: IVNode, parentElm?: Element): boolean {
    // 源码是用data判断的
    // 这里为了清晰加了一个变量
    if (vnode.isComponent) {
      invokeComponentHook("init", vnode);
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
      // 创建节点
      vnode.elm = nodeOps.createElement(tag, vnode);
      // 创建子节点
      this.createChildren(vnode, children);
      // 激活对应的hook
      if (isDef(vnode.data)) {
        this.invokeCreateHooks(vnode);
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
    // 激活组件节点的Prepatch钩子
    if (vnode.isComponent) {
      invokeComponentHook("prepatch", vnode, oldVnode);
    }
    this.invokeUpdateHook(oldVnode, vnode);
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
    // 这里是摧毁逻辑
    if (isUndef(vnode)) {
      return;
    }
    // 如果新节点存在且老节点不存在，这里是新建逻辑
    if (isUndef(oldVnode)) {
      this.patchStack.push({
        isInitialPatch: true,
        insertedVnodeQueue: []
      });
      // 如果老节点不存在
      this.createElm(vnode);
    } else {
      this.patchStack.push({
        isInitialPatch: false,
        insertedVnodeQueue: []
      });
      // 检查是否是真实dom节点
      const isRealElement = !(oldVnode instanceof VNode);
      // 两个都存在，并且不是真实节点，直接patch
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
    // patch运行完毕，将最后一个出栈
    this.invokeInsertHook(vnode);
    this.patchStack.pop();
    return vnode.elm;
  }
}
