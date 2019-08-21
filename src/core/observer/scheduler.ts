import { Watcher } from "./watcher";
import { nextTick } from "../util/nextTick";

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
    for (let watcher of this.queue) {
      this.queue.delete(watcher);
      watcher.run();
    }
    this.resetSchedulerState();
  }

  resetSchedulerState() {
    this.queue.clear();
  }
}

const scheduler = new Scheduler();

export const queueWatcher = scheduler.queueWatcher.bind(scheduler);
