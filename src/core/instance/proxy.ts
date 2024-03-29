import { getSharedPropertyDefinition, bind } from "../../shared/utils";
import { Vue } from "../index";

function getSourceObject(target: Object, sourceKey: string) {
  return sourceKey.split(".").reduce(function(pre, item) {
    return pre[item];
  }, target);
}

function setSourceObject(
  target: Object,
  sourceKey: string,
  key: string,
  val: any
) {
  sourceKey.split(".").reduce(function(pre, item, index, arr) {
    if (index === arr.length - 1) {
      pre[item][key] = val;
    }
    return pre[item];
  }, target);
}
export function proxy(
  target: Object,
  sourceKey: string,
  key: string,
  isBind?: boolean
) {
  const sharedPropertyDefinition = getSharedPropertyDefinition();
  sharedPropertyDefinition.get = function proxyGetter() {
    let result = getSourceObject(this, sourceKey)[key];
    if (isBind && typeof result === "function") {
      result = bind(result, target);
    }
    return result;
  };
  sharedPropertyDefinition.set = function proxySetter(val) {
    setSourceObject(this, sourceKey, key, val);
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

export function proxyMethods(vm: Vue) {
  const methods = vm.$options.methods;
  for (const name in methods) {
    proxy(vm, "$options.methods", name, true);
  }
}
