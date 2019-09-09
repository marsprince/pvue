const _toString = Object.prototype.toString;

export function isObject(obj: any): boolean {
  return obj !== null && typeof obj === "object";
}

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

export function isPlainObject(obj: any): boolean {
  return _toString.call(obj) === "[object Object]";
}

// 用于字符串格式化
export function toString(val: any): string {
  return val === null
    ? ""
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
    ? JSON.stringify(val, null, 2)
    : String(val);
}

const hasOwnProperty = Object.prototype.hasOwnProperty;
export function hasOwn(obj: Object | Array<any>, key: string): boolean {
  return hasOwnProperty.call(obj, key);
}

export function getSharedPropertyDefinition() {
  return {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
  };
}

export function defineProperty(
  obj: Object,
  key: string,
  val: any,
  enumerable?: boolean
) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

export function isPromise(val: any): boolean {
  return (
    isDef(val) &&
    typeof val.then === "function" &&
    typeof val.catch === "function"
  );
}

/**
 * Remove an item from an array.
 */
export function remove(arr: Array<any>, item: any): Array<any> | void {
  if (arr.length) {
    const index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1);
    }
  }
}
