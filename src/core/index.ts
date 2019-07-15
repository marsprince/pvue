export class Vue {
  // 合并后的options
  $options: any = {};
  // dom节点
  $el: any;

  constructor(options: object) {
    this._init(options);
  }

  _init(options: object) {
    // 复杂的合并规则
    this.$options = options;
  }

  // 调用render方法，把实例渲染成一个虚拟 Node，
  _render() {
    this.$el = this.$options.render.call(this, this.$createElement);
  }

  // 返回一个vnode
  $createElement(tag: string) {
    return document.createElement(tag);
  }

  // 挂载，和平台有关
  $mount(el: any) {
    this._render();
    if (typeof el === "string") {
      document.querySelector(el).append(this.$el);
    }
  }
}
