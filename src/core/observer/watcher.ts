import { Dep } from "./dep";
import { Vue } from "..";
import { queueWatcher } from "./scheduler";
import { parsePath } from "../util/observer";
import { IWatcherOptions } from "../../@types/observer";
import { traverse } from "./traverse";

class TargetStack<T> {
  target: T = null;
  targetStack = [];
  getCurrentTarget(): T {
    return this.target;
  }
  pushTarget(target: T) {
    this.targetStack.push(target);
    this.target = target;
  }
  popTarget() {
    this.targetStack.pop();
    this.target = this.targetStack[this.targetStack.length - 1];
  }
}

export const watcherStack = new TargetStack<Watcher>();
let id = 0;
// 因为每次render都会触发收集，而每次依赖收集是有可能不一样的
// 因此新建两个数组，一个deps，一个newDeps
class BaseWatcher {
  deps: Set<Dep> = new Set();
  newDeps: Set<Dep> = new Set();
  // 传进来的重新渲染需要的函数或者字符串表达式
  getter: Function;
  value: any;
  vm: Vue;
  id: number;
  cb: any;
  // 代表运行过get进行依赖收集
  isGet: boolean = false;
  options: IWatcherOptions;
  isRenderWatcher: boolean = false;

  constructor(
    vm: Vue,
    expOrFn: string | Function,
    cb?: any,
    options: IWatcherOptions = {}
  ) {
    // 如果expOrFn是一个函数，代表getter函数
    // 如果expOrFn是一个字符串，代表路径，这时候要返回一个getter，获得对象
    if (typeof expOrFn === "function") {
      this.getter = expOrFn;
    } else {
      this.getter = parsePath(expOrFn);
    }
    this.vm = vm;
    this.id = ++id;
    this.cb = cb;
    this.options = options;
  }
  // get返回的是一个计算值，如果是字符串，那么会返回vm.a，是个引用
  get() {
    // 先要把当前watcher放到栈里
    watcherStack.pushTarget(this);
    let value;
    try {
      // 第二个参数是给parsePath的function用的
      value = this.getter.call(this.vm, this.vm);
    } catch (e) {
      throw e;
    } finally {
      if (this.options.deep) {
        traverse(value);
      }
      watcherStack.popTarget();
      this.cleanupDeps();
    }
    this.isGet = true;
    return value;
  }
  addDep(dep: Dep) {
    // 先收集一轮，这里使用了set，其实不用去重，但是为了可读性，还是加上了
    if (!this.newDeps.has(dep)) {
      this.newDeps.add(dep);
      // 如果没有添加过依赖，就添加，因为dep里面是数组，没有做去重，很关键
      if (!this.deps.has(dep)) {
        dep.addSub(this);
      }
    }
  }
  update() {
    // 异步更新
    if (this.options.sync) {
      this.run();
    } else {
      queueWatcher(this);
    }
  }
  run() {
    // 触发回调
    const value = this.get();
    if (this.value !== value || this.options.deep) {
      const oldValue = this.value;
      this.value = value;
      if (this.cb) {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
  cleanupDeps() {
    // 要把原来的dep中有的，并且新dep中不存在的删除
    for (let dep of this.deps) {
      if (!this.newDeps.has(dep)) {
        dep.removeSub(this);
      }
    }
    // 互换依赖
    [this.deps, this.newDeps] = [this.newDeps, this.deps];
    this.newDeps.clear();
  }
  // 摧毁这个watcher
  teardown() {
    for (let dep of this.deps) {
      dep.removeSub(this);
    }
  }
}
export class Watcher extends BaseWatcher {
  constructor(
    vm: Vue,
    expOrFn: string | Function,
    cb?: any,
    options: IWatcherOptions = {}
  ) {
    super(vm, expOrFn, cb, options);
    this.value = this.get();
  }
}

export class ComputedWatcher extends BaseWatcher {
  // computedDep = new Dep();
  evaluate() {
    this.value = this.get();
  }
  depend() {
    for (let dep of this.deps) {
      dep.depend();
    }
  }
  // run() {
  //   const oldValue = this.value;
  //   const newValue = this.get();
  //   if (oldValue !== newValue) {
  //     this.value = newValue;
  //     this.computedDep.notify({
  //       sync: true
  //     });
  //   }
  // }
}
