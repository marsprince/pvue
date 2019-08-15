import { defineProperty } from "../../shared/utils";
// 添加一个继承自array的对象，这个上面具有如下方法，然后再让数组去继承它
const arrayProto = Array.prototype;
export const arrayBridgeProto = Object.create(arrayProto);

const methodsToPatch = [
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "sort",
  "reverse"
];
methodsToPatch.forEach(function(method) {
  // cache original method
  const original = arrayProto[method];
  defineProperty(arrayBridgeProto, method, function(...args) {
    const result = original.apply(this, args);
    const ob = this.__ob__;
    let inserted;
    switch (method) {
      case "push":
      case "unshift":
        inserted = args;
        break;
      case "splice":
        inserted = args.slice(2);
        break;
    }
    // 对插入的新数组中的元素继续ob
    if (inserted) ob.observeArray(inserted);
    ob.depForSet.notify();
    return result;
  });
});
