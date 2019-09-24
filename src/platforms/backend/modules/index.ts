import { updateDOMListeners } from "./events";
import { Hooks } from "../../../core/vdom/modules/hooks.enum";
import { hook as baseHooks } from "../../../core/vdom/modules";

export const hook = {
  [Hooks.Create]: [updateDOMListeners].concat(baseHooks[Hooks.Create]),
  [Hooks.Update]: [updateDOMListeners].concat(baseHooks[Hooks.Update])
};

export default {
  hook
};
