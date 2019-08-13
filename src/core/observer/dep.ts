import { Watcher, watcherStack } from "./watcher";

// dep有一个数组，记录着watcher
// 因此dep是在每一个对象上面都新建，因此尽量把逻辑移到watcher里
export class Dep {
  subs: Array<Watcher>;

  constructor() {
    this.subs = [];
  }
  addSub(sub: Watcher) {
    this.subs.push(sub);
  }
  depend() {
    // 通知收集到了依赖
    // 这时候要把watcher拉进来
    // 源码是将watcher加进去，感觉不是很直观，这里调了一下，因为dep是中心，watcher只是受控组件
    this.subs.push(watcherStack.getCurrentTarget());
  }
  notify() {
    // 收到了变化通知
    for (let i = 0, l = this.subs.length; i < l; i++) {
      this.subs[i].update();
    }
  }
}
