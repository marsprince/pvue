import { invokeWithErrorHandling } from "../util/error";

export function emit(event: string, ...args) {
  const vm = this;
  let cbs = vm._events[event];
  if (cbs) {
    // cbs = cbs.length > 1 ? toArray(cbs) : cbs;
    // const args = toArray(arguments, 1);
    const info = `event handler for "${event}"`;
    for (let i = 0, l = cbs.length; i < l; i++) {
      invokeWithErrorHandling(cbs[i], vm, args, vm, info);
    }
  }
  return vm;
}
