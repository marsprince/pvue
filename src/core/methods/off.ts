// 移除自定义事件监听器。
// 如果没有提供参数，则移除所有的事件监听器；
// 如果只提供了事件，则移除该事件所有的监听器；
// 如果同时提供了事件与回调，则只移除这个回调的监听器。
export function off(event?: string | Array<string>, fn?: Function) {
  const vm = this;
  // all
  if (!event && !fn) {
    vm._events = Object.create(null);
    return vm;
  }
  // array of events
  if (Array.isArray(event)) {
    for (let i = 0, l = event.length; i < l; i++) {
      vm.$off(event[i], fn);
    }
    return vm;
  }
  // specific event
  const cbs = vm._events[event];
  if (!cbs) {
    return vm;
  }
  // no fn
  if (!fn) {
    vm._events[event] = null;
    return vm;
  }
  // specific handler
  let cb;
  let i = cbs.length;
  while (i--) {
    cb = cbs[i];
    // cb.fn use for $once
    if (cb === fn || cb.fn === fn) {
      cbs.splice(i, 1);
      break;
    }
  }
  return vm;
}
