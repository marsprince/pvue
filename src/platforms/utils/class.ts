import { IVNode, IVNodeData } from "../../@types/vnode";
import { isDef, isObject } from "../../shared/utils";

export function genClassForVnode(vnode: IVNode): string {
  let data = vnode.data;
  let parentNode = vnode.parent;
  let childNode = vnode;
  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode;
    if (childNode && childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while (isDef(parentNode)) {
    parentNode = parentNode.parent;
    if (parentNode && parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return renderClass(data.class, data.staticClass);
}

function mergeClassData(
  child: IVNodeData,
  parent: IVNodeData
): {
  staticClass: string;
  class: any;
} {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class) ? [child.class, parent.class] : parent.class
  };
}

export function renderClass(dynamicClass: any, staticClass?: string): string {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass));
  }
  /* istanbul ignore next */
  return "";
}

export function concat(a?: string, b?: string): string {
  return a ? (b ? a + " " + b : a) : b || "";
}

export function stringifyClass(value: any): string {
  if (Array.isArray(value)) {
    return stringifyArray(value);
  }
  if (isObject(value)) {
    return stringifyObject(value);
  }
  if (typeof value === "string") {
    return value;
  }
  /* istanbul ignore next */
  return "";
}

function stringifyArray(value: Array<any>): string {
  let res = "";
  let stringified;
  for (let i = 0, l = value.length; i < l; i++) {
    stringified = stringifyClass(value[i]);
    if (isDef(stringified) && stringified !== "") {
      if (res) res += " ";
      res += stringified;
    }
  }
  return res;
}

function stringifyObject(value: Object): string {
  let res = "";
  for (const key in value) {
    if (value[key]) {
      if (res) res += " ";
      res += key;
    }
  }
  return res;
}
