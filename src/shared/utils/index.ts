export function isUndef(v: any): boolean {
  return v === undefined || v === null;
}

export function isDef(v: any): boolean {
  return v !== undefined && v !== null;
}

export function noop(a?: any) {}

export function bind(fn: Function, ctx: object) {
  return fn.bind(ctx);
}
