import { hasOwn } from "../../shared/utils";
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

export function mergeOptions(parent: any, child: any, vm: any) {
  if (typeof child === "function") {
    child = child.options;
  }
  const options = {};
  const strats = vm.constructor.config.optionMergeStrategies;
  for (let key in child) {
    if (!hasOwn(parent, key)) {
      const strat = strats[key] || defaultStrat;
      mergeField(key, parent, child, options, strat);
    }
  }
  return options;
}
