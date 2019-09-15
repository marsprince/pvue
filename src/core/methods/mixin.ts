import { ComponentOptions } from "../../@types/vue";
import { mergeOptions } from "../util/options";

export function mixin(mixin: ComponentOptions) {
  this.options = mergeOptions(this.options, mixin);
  return this;
}
