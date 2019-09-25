import { IVNode } from "../../../@types/vnode";
import { isDef, remove } from "../../../shared/utils";

function registerRef(vnode: IVNode) {
  const key = vnode.data.ref;
  if (!isDef(key)) return;

  const vm = vnode.context;
  // 在组件节点上就是组件，否则就是元素
  const ref = vnode.componentInstance || vnode.elm;
  const refs = vm.$refs;
  if (vnode.data.refInFor) {
    if (!Array.isArray(refs[key])) {
      refs[key] = [ref];
    } else if (refs[key].indexOf(ref) < 0) {
      refs[key].push(ref);
    }
  } else {
    refs[key] = ref;
  }
}

function unRegisterRef(vnode: IVNode) {
  const key = vnode.data.ref;
  if (!isDef(key)) return;

  const vm = vnode.context;
  const ref = vnode.componentInstance || vnode.elm;
  const refs = vm.$refs;
  if (Array.isArray(refs[key])) {
    remove(refs[key], ref);
  } else if (refs[key] === ref) {
    refs[key] = undefined;
  }
}

// 为什么使用modules而不是directives，官方的说法是可以配合v-for做动态
export default {
  create(_: any, vnode: IVNode) {
    registerRef(vnode);
  },
  update(oldVnode: IVNode, vnode: IVNode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      unRegisterRef(oldVnode);
      registerRef(vnode);
    }
  },
  destroy(vnode: IVNode) {
    unRegisterRef(vnode);
  }
};
