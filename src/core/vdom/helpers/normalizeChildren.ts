import { isPrimitive, isUndef } from "../../../shared/utils";
import { createTextVNode } from "../vnode";
import { IVNode } from "../../../@types/vnode";

function normalizeArrayChildren(children: any) {
  const res = [];
  let i, c;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === "boolean") continue;
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c);
        // merge adjacent text nodes
        res.push.apply(res, c);
      }
    } else {
      res.push(c);
    }
  }
  return res;
}

// 允许render函数返回一个文字，创建一个文字节点
export function normalizeChildren(children: any): Array<IVNode> {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
    ? normalizeArrayChildren(children)
    : undefined;
}

export function simpleNormalizeChildren(children: any) {
  for (let i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children);
    }
  }
  return children;
}
