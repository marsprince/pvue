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

  _render() {
    this.$el = this.$options.render.call(this, this.$createElement);
  }

  $createElement(tag: string) {
    return document.createElement(tag);
  }

  $mount(el: any) {
    this._render();
    if (typeof el === "string") {
      document.querySelector(el).append(this.$el);
    }
  }
}
