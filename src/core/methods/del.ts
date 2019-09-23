import { hasOwn } from "../../shared/utils";
import { Observer } from "../observer/observe";

export function del(target: Array<any> | Object, key: any) {
  if (Array.isArray(target)) {
    target.splice(key, 1);
    return;
  }
  const ob: Observer = (target as any).__ob__;
  if (!hasOwn(target, key)) {
    return;
  }
  delete target[key];
  if (!ob) {
    return;
  }
  ob.depForSet.notify();
}
