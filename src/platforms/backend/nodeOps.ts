import { IVNode } from "../../@types/vnode";

export function createElement(tagName: string, vnode: IVNode): Element {
  const elm = document.createElement(tagName);
  if (tagName !== "select") {
    return elm;
  }
  // // false or null will remove the attribute but undefined will not
  // if (
  //   vnode.data &&
  //   vnode.data.attrs &&
  //   vnode.data.attrs.multiple !== undefined
  // ) {
  //   elm.setAttribute("multiple", "multiple");
  // }
  return elm;
}

export function appendChild(node: Node, child: Node) {
  node.appendChild(child);
}

export function createTextNode(text: string): Text {
  return document.createTextNode(text);
}

export default {
  createElement,
  appendChild,
  createTextNode
};
