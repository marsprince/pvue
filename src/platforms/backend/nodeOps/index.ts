import { IVNode } from "../../../@types/vnode";

function createElement(tagName: string, vnode: IVNode): Element {
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

function appendChild(node: Node, child: Node) {
  node.appendChild(child);
}

function createTextNode(text: string): Text {
  return document.createTextNode(text);
}

function setTextContent(node: Node, text: string) {
  node.textContent = text;
}

function tagName(node: Element): string {
  return node.tagName;
}

function parentNode(node: Node): Node | undefined {
  return node.parentNode;
}

function createComment(text: string): Comment {
  return document.createComment(text);
}

function nextSibling(node: Node): Node {
  return node.nextSibling;
}

function insertBefore(parentNode: Node, newNode: Node, referenceNode: Node) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild(node: Node, child: Node) {
  node.removeChild(child);
}

export default {
  createElement,
  appendChild,
  createTextNode,
  setTextContent,
  tagName,
  parentNode,
  createComment,
  nextSibling,
  insertBefore,
  removeChild
};
