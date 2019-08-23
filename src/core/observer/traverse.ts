import { isObject } from "util";

const seenObjects = new Set();
export function traverse(val: any) {
  // 遍历val，并触发getter
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse(val: any, seen: Set<any>) {
  let i, keys;
  const isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val)) {
    return;
  }
  if (val.__ob__) {
    const dep = val.__ob__.depForSet;
    if (seen.has(dep)) {
      return;
    }
  }
  if (isA) {
    i = val.length - 1;
    while (i--) _traverse(val[i], seen);
  } else {
    keys = Object.keys(val);
    for (let i = 0; i < keys.length; i++) {
      _traverse(val[keys[i]], seen);
    }
  }
}
