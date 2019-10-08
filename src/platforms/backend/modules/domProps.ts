import { isUndef } from "../../../shared/utils";

export function updateDomProps(oldVnode, vnode) {
  if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
    return;
  }
  const elm = vnode.elm;
  let props = vnode.data.domProps || {};
  const oldProps = oldVnode.data.domProps || {};
  // first:delete
  for (let key in oldProps) {
    if (!(key in props)) {
      elm[key] = "";
    }
  }

  // then add
  for (let key in props) {
    const cur = props[key];
    if (key === "textContent" || key === "innerHTML") {
      if (vnode.children) vnode.children.length = 0;
      if (cur === oldProps[key]) continue;
      // #6601 work around Chrome version <= 55 bug where single textNode
      // replaced by innerHTML/textContent retains its parentNode property
      if (elm.childNodes.length === 1) {
        elm.removeChild(elm.childNodes[0]);
      }
    }
    elm[key] = cur;
  }
}
