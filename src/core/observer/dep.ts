import { Watcher, watcherStack } from "./watcher";

// dep有一个数组，记录着watcher
// 因此dep是在每一个对象上面都新建，因此尽量把逻辑移到watcher里
export class Dep {
  subs: Set<Watcher>;

  constructor() {
    this.subs = new Set();
  }
  removeSub(sub: Watcher) {
    this.subs.delete(sub);
  }
  addSub(sub: Watcher) {
    this.subs.add(sub);
  }
  depend() {
    // 通知收集到了依赖
    // 这时候要把watcher拉进来
    const target = watcherStack.getCurrentTarget();
    if (target) {
      target.addDep(this);
    }
  }
  notify() {
    // 收到了变化通知
    for (let sub of this.subs) {
      sub.update();
    }
  }
}
