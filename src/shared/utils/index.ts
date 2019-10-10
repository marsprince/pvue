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

/**
 * Check if value is primitive.
 */
export function isPrimitive(value: any): boolean {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    // $flow-disable-line
    typeof value === "symbol" ||
    typeof value === "boolean"
  );
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

/**
 * Create a cached version of a pure function.
 */
export function cached(fn: Function): Function {
  const cache = Object.create(null);
  return function cachedFn(str: string) {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

/**
 * Camelize a hyphen-delimited string.
 */
const camelizeRE = /-(\w)/g;
export const camelize = cached(
  (str: string): string => {
    return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ""));
  }
);

/**
 * Capitalize a string.
 */
export const capitalize = cached(
  (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
);

/**
 * Hyphenate a camelCase string.
 */
const hyphenateRE = /\B([A-Z])/g;
export const hyphenate = cached(
  (str: string): string => {
    return str.replace(hyphenateRE, "-$1").toLowerCase();
  }
);

/**
 * Mix properties into target object.
 */
export function extend(to: Object, _from?: Object): Object {
  for (const key in _from) {
    to[key] = _from[key];
  }
  return to;
}

/**
 * Merge an Array of Objects into a single Object.
 */
export function toObject(arr: Array<any>): Object {
  const res = {};
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res;
}
