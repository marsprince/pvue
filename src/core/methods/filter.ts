export function filter(id: string, fn: Function) {
  this.options.filters[id] = fn;
}
