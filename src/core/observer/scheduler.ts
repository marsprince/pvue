import { Watcher } from "./watcher";
import { nextTick } from "../util/nextTick";
import { callHook } from "../instance/lifeCycle";

class Scheduler {
  has: {};
  queue: Set<any> = new Set();
  /**
   * Push a watcher into the watcher queue.
   * Jobs with duplicate IDs will be skipped unless it's
   * pushed when the queue is being flushed.
   */
  queueWatcher(watcher: Watcher) {
    if (!this.queue.has(watcher)) {
      this.queue.add(watcher);
      nextTick(this.flushSchedulerQueue, this);
    }
  }

  // watcher的添加顺序，computed => watcher => render
  flushSchedulerQueue() {
    const updatedQueue = new Set([...this.queue]);
    for (let watcher of this.queue) {
      if (watcher.isRenderWatcher) {
        callHook(watcher.vm, "beforeUpdate");
      }
      this.queue.delete(watcher);
      watcher.run();
    }
    this.callUpdatedHooks(updatedQueue);
    this.resetSchedulerState();
  }

  resetSchedulerState() {
    this.queue.clear();
  }

  callUpdatedHooks(updatedQueue: Set<any>) {
    for (let watcher of updatedQueue) {
      const vm = watcher.vm;
      // 确保只有renderWatcher的触发会引起updated
      if (watcher.isRenderWatcher) {
        callHook(vm, "updated");
      }
    }
  }
}

const scheduler = new Scheduler();

export const queueWatcher = scheduler.queueWatcher.bind(scheduler);
