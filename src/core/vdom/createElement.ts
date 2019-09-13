import { IVNodeData } from "../../@types/vnode";
import { Vue } from "../index";
import VNode from "./vnode";
import { resolveAsset } from "../util/options";
import { createComponent } from "./createComponent";

// 外界调用的,初始化逻辑移出
export function createElement(tag?: any, data?: IVNodeData, children?: any) {
  if (!tag) {
    // 如果没有tag，则返回一个空文本节点
    return this._v();
  }
  let vnode;
  // tag有多种可能
  // 第一种，字符串
  if (typeof tag === "string") {
    // 并且是html保留标签
    if (Vue.config.isReservedTag(tag)) {
      vnode = new VNode(Vue.config.parsePlatformTagName(tag), data, children);
      vnode.context = this;
    } else if (resolveAsset(this.$options, "components", tag)) {
      const Ctor = resolveAsset(this.$options, "components", tag);
      // createComponent
      vnode = createComponent(Ctor, this, data, children, tag);
    }
  }
  return vnode;
}
