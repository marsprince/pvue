import { isReservedTag, parsePlatformTagName } from "../config/index";
import { mount, Patch } from "../runtime/index";
import backend from "../backend";

export function installPlatformConfig(target: any) {
  target.config.isReservedTag = isReservedTag;
  target.config.parsePlatformTagName = parsePlatformTagName;
}

export function installPlatformFunction(target: any) {
  target.$mount = mount;
  let patchClass = new Patch(backend);
  target.__patch__ = patchClass.patch.bind(patchClass);
}
