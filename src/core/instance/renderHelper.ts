import { resolveAsset } from "../util/options";
import { IVNode } from "../../@types/vnode";

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
