import { Vue } from "..";
import { lifeCycle } from "../../shared/constant";
import { mergeHook } from "../util/options";
import { extend } from "../../shared/utils";
import builtInComponents from "../components";

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets(
  parentVal?: Object,
  childVal?: Object,
  vm?: any,
  key?: string
): Object {
  const res = Object.create(parentVal || null);
  if (childVal) {
    return extend(res, childVal);
  } else {
    return res;
  }
}

// 初始化合并策略
export function initOptionMergeStrategies(vueConstructor: typeof Vue) {
  const strats = (vueConstructor.config.optionMergeStrategies = {});
  // hook
  for (let hook in lifeCycle) {
    strats[hook] = mergeHook;
  }
  // component, directive, filter
  ["component", "directive", "filter"].forEach(function(type) {
    strats[type + "s"] = mergeAssets;
  });
}

// Vue.config init
export function initVueConfig(vueConstructor: typeof Vue) {
  initOptionMergeStrategies(vueConstructor);
  extend(vueConstructor.options.components, builtInComponents);
  Vue.options._base = vueConstructor;
}
