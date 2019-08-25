import { compileToFunctions } from "../../compiler/index";
import { Watcher } from "../../core/observer/watcher";
import { callHook } from "../../core/instance/lifeCycle";

// 挂载，和平台有关
export function mount(el: any) {
  const options = this.$options;
  // 添加编译相关
  const ref = compileToFunctions(this.$options.template);
  options.render = ref.render;
  options.staticRenderFns = ref.staticRenderFns;
  console.log(ref.render.toString(), ref.staticRenderFns.toString());

  callHook(this, "beforeMount");
  // 渲染
  // 增加watcher
  const renderWatcher = new Watcher(this, () => {
    this._update(this._render());
  });
  renderWatcher.isRenderWatcher = true;
  this._watcher = renderWatcher;

  callHook(this, "mounted");

  // 挂载
  if (typeof el === "string") {
    document.querySelector(el).append(this.$el);
  }
}
