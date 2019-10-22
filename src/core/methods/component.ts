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
      options = this.extend(options);
    }
    this.options.components[id] = options;
    return this.options.components[id];
  }
}
