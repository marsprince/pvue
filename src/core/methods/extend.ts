import { VueComponent } from "../index";
import { ComponentOptions } from "../../@types/vue";
import { mergeOptions } from "../util/options";

let cid = 1;

export function extend(extendOptions: ComponentOptions) {
  extendOptions = extendOptions || {};
  const Super = this;
  const SuperId = Super.cid;
  // 缓存
  const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
  if (cachedCtors[SuperId]) {
    return cachedCtors[SuperId];
  }
  // 组件名
  const name = extendOptions.name || Super.options.name;
  const Sub = VueComponent();
  // cid
  Sub.cid = cid++;
  // 合并配置
  Sub.options = mergeOptions(Super.options, extendOptions);
  Sub.super = Super;
  if (name) {
    Sub.options.components[name] = Sub;
  }
  // cache constructor
  cachedCtors[SuperId] = Sub;
  return Sub;
}
