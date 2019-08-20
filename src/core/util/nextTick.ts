class NextTick {
  callbacks: Array<any> = [];
  pending: boolean = false;
  timerFunc() {
    // 先简单的用Promise实现一下
    Promise.resolve().then(() => {
      this.flushCallbacks();
    });
  }
  // 清空并执行cb
  flushCallbacks() {
    const copies = this.callbacks.slice(0);
    this.callbacks.length = 0;
    for (let i = 0; i < copies.length; i++) {
      copies[i]();
    }
    this.pending = false;
  }
  nextTick(cb?: Function, ctx?: any) {
    this.callbacks.push(() => {
      if (cb) {
        try {
          ctx ? cb.call(ctx) : cb();
        } catch {}
      }
    });
    if (!this.pending) {
      this.pending = true;
      this.timerFunc();
    }
  }
}

const _nextTick = new NextTick();
export const nextTick = _nextTick.nextTick.bind(_nextTick);
