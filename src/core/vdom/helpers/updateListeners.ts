import { isUndef } from "../../../shared/utils";

export function updateListeners(
  target: any,
  on: Object,
  oldOn: Object,
  add: Function,
  remove: Function
) {
  // on是一个形如{click:function}的对象
  // 先添加
  for (let name in on) {
    const cur = on[name];
    const old = oldOn[name];

    // 旧的不存在，说明是新增
    if (isUndef(old)) {
      add(target, name, cur);
    }
  }
  // 再删除
}
