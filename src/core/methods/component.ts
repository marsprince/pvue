import { ComponentOptions } from "../../@types/vue";
import { isPlainObject } from "../../shared/utils";

export function component(id: string, options?: ComponentOptions) {
  // 如果没有传options
  if (!options) {
    return this.options.components[id];
  } else {
    // set name
    if (isPlainObject(options)) {
      options.name = options.name || id;
    }
    this.options.components[id] = this.extend(options);
    return this.options.components[id];
  }
}
