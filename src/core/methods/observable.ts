import { observe } from "../observer/observe";
export function observable(obj: object) {
  observe(obj);
  return obj;
}
