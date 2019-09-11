export function once(event: string, fn: Function) {
  const vm = this;
  function on(...args) {
    vm.$off(event, on);
    fn.apply(vm, args);
  }
  on.fn = fn;
  vm.$on(event, on);
  return vm;
}
