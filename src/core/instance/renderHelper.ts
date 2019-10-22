import { resolveAsset } from "../util/options";
import { IVNode } from "../../@types/vnode";
import { ScopedSlotsData } from "../../@types/vue";
import { vueComponent } from "../../@types/vue";

export let currentRenderingInstance: any;

export function resolveFilter(id: string) {
  return resolveAsset(this.$options, "filters", id);
}

// 接受形如value, name, index或value, index
export function renderList(
  val: any,
  render: (val: any, keyOrIndex: string | number, index?: number) => IVNode
): Array<IVNode> {
  let ret: Array<IVNode> = [];
  let i, l;
  // 事实上，v-for不仅支持数组，还支持对象、数字和任意部署了Symbol.iterator的类型
  if (Array.isArray(val) || typeof val === "string") {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      // 数组就两个参数
      ret[i] = render(val[i], i);
    }
  }
  // TODO：其他支持
  (ret as any)._isVList = true;
  return ret;
}

// 这里的context是父组件，即插入slots的组件
export function resolveSlots(children: Array<IVNode>, context?: vueComponent) {
  if (!children || !children.length) {
    return {};
  }
  const slots: any = {};
  for (let i = 0, l = children.length; i < l; i++) {
    const child = children[i];
    const data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if (
      (child.context === context || child.fnContext === context) &&
      data &&
      data.slot != null
    ) {
      const name = data.slot;
      const slot = slots[name] || (slots[name] = []);
      if (child.tag === "template") {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      (slots.default || (slots.default = [])).push(child);
    }
  }
  return slots;
}

export function renderSlot(name: string, fallback?: any, props = {}) {
  // 这部分在2.5和2.6没有任何改动
  // 对于slot和scopedSlots来说都是一样的，都走这个流程，先从scopedSlots里取
  // vue2.6 v-slot:header 走的scopedSlots
  const scopedSlotFn = this.$scopedSlots[name];
  let nodes;
  if (scopedSlotFn) {
    nodes = scopedSlotFn(props) || fallback;
  } else {
    nodes = this.$slots[name] || fallback;
  }
  return nodes;
}

// 将形如[{key:"header",fn: function]的形式打平并返回到一个对象里
export function resolveScopedSlots(
  fns: ScopedSlotsData, // see flow/vnode
  res?: Object,
  // the following are added in 2.6
  hasDynamicKeys?: boolean,
  contentHashKey?: number
): any {
  res = res || {};
  for (let i = 0; i < fns.length; i++) {
    const slot = fns[i];
    if (Array.isArray(slot)) {
      resolveScopedSlots(slot, res, hasDynamicKeys);
    } else if (slot) {
      // marker for reverse proxying v-slot without scope on this.$slots
      if (slot.proxy) {
        slot.fn.proxy = true;
      }
      res[slot.key] = slot.fn;
    }
  }
  // if (contentHashKey) {
  //   (res: any).$key = contentHashKey
  // }
  return res;
}
