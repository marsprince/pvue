import { isReservedTag, parsePlatformTagName } from "../config/index";
import { mount, runTimeMount } from "../runtime/index";
import { Patch } from "../../core/vdom/patch";
import backend from "../backend";
import { Vue } from "../../core/index";

export function installPlatformConfig(target: any) {
  target.config.isReservedTag = isReservedTag;
  target.config.parsePlatformTagName = parsePlatformTagName;
}

// 接受vue.prorotype，返回Vue
export function installPlatformFunction(
  target: any,
  isRuntime: boolean = false
): typeof Vue {
  if (isRuntime) {
    target.$mount = runTimeMount;
  } else {
    target.$mount = mount;
  }
  let patchClass = new Patch(backend);
  target.__patch__ = patchClass.patch.bind(patchClass);
  return target.constructor;
}
