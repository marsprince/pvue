import { Vue } from "..";
import { lifeCycle } from "../../shared/constant";
import { mergeHook } from "../util/options";

// 初始化合并策略
export function initOptionMergeStrategies(vueConstructor: typeof Vue) {
  const strats = (vueConstructor.config.optionMergeStrategies = {});
  // hook
  for (let hook in lifeCycle) {
    strats[hook] = mergeHook;
  }
}

// Vue.config init
export function initVueConfig(vueConstructor: typeof Vue) {
  initOptionMergeStrategies(vueConstructor);
}
