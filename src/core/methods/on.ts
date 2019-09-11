// 接受event字符串或者数组
export function on(event: string | Array<string>, fn: Function) {
  const hookRE = /^hook:/;
  const vm = this;
  if (Array.isArray(event)) {
    for (let i = 0, l = event.length; i < l; i++) {
      vm.$on(event[i], fn);
    }
  } else {
    (vm._events[event] || (vm._events[event] = [])).push(fn);
    // optimize hook:event cost by using a boolean flag marked at registration
    // instead of a hash lookup
    if (hookRE.test(event)) {
      // 如果添加了hookEvent，则置为true在callHook的是时候emit
      vm._hasHookEvent = true;
    }
  }
  return vm;
}
