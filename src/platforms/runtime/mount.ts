import { compileToFunctions } from "../../compiler/index";
import { Watcher } from "../../core/observer/watcher";

// 挂载，和平台有关
export function mount(el: any) {
  const options = this.$options;
  // 添加编译相关
  const ref = compileToFunctions(this.$options.template);
  options.render = ref.render;
  options.staticRenderFns = ref.staticRenderFns;
  console.log(ref.render.toString(), ref.staticRenderFns.toString());

  // 渲染
  // 增加watcher
  new Watcher(this, () => {
    this._update(this._render());
  });

  // 挂载
  if (typeof el === "string") {
    document.querySelector(el).append(this.$el);
  }
}
