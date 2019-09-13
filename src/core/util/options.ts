import { hasOwn } from "../../shared/utils";
import { Vue } from "../index";
import { camelize, capitalize } from "../../shared/utils";
/**
 * Default strategy.
 */
const defaultStrat = function(parentVal: any, childVal: any): any {
  return childVal === undefined ? parentVal : childVal;
};
function dedupeHooks(hooks) {
  const res = [];
  for (let i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}

function mergeField(key, parent, child, options, strat) {
  options[key] = strat(parent[key], child[key]);
}

export function mergeHook(
  parentVal?: Array<Function>,
  childVal?: Function | Array<Function>
): any {
  const res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
      ? childVal
      : [childVal]
    : parentVal;
  return res ? dedupeHooks(res) : res;
}

export function mergeOptions(parent: any, child: any, vm?: any) {
  if (typeof child === "function") {
    child = child.options;
  }
  const options = {};
  const strats = Vue.config.optionMergeStrategies;
  for (let key in parent) {
    const strat = strats[key] || defaultStrat;
    mergeField(key, parent, child, options, strat);
  }
  for (let key in child) {
    if (!hasOwn(parent, key)) {
      const strat = strats[key] || defaultStrat;
      mergeField(key, parent, child, options, strat);
    }
  }
  return options;
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
export function resolveAsset(options: Object, type: string, id: string): any {
  /* istanbul ignore if */
  if (typeof id !== "string") {
    return;
  }
  const assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) return assets[id];
  // 驼峰转换
  const camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) return assets[camelizedId];
  // 首字母大写
  const PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) return assets[PascalCaseId];
  // fallback to prototype chain
  const res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  return res;
}
