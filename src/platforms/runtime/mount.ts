import { compileToFunctions } from "../../compiler/index";
import { query, inBrowser } from "../utils";
import { mountComponent } from "../../core/instance/lifeCycle";

// 挂载，和平台有关
export function mount(el: any) {
  const options = this.$options;
  // 添加编译相关
  const ref = compileToFunctions(this.$options.template);
  options.render = ref.render;
  options.staticRenderFns = ref.staticRenderFns;
  console.log(ref.render.toString(), ref.staticRenderFns.toString());

  return runTimeMount.call(this, el);
}

export function runTimeMount(el: any) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent.call(this, el);
}
