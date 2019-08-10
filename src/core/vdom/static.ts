import { IVNode } from "../@types/vnode";

function markStaticNode(node: IVNode, key: string, isOnce = false) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

// 将sdtaticTree标记为静态，并设置一个key
export function markStatic(tree: IVNode | Array<IVNode>, key: string) {
  if (Array.isArray(tree)) {
    for (let i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== "string") {
        markStaticNode(tree[i], `${key}_${i}`);
      }
    }
  } else {
    markStaticNode(tree, key);
  }
}
