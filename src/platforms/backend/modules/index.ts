import { updateDOMListeners } from "./events";
import { updateDomProps } from "./domProps";
import { Hooks } from "../../../core/vdom/modules/hooks.enum";
import { hook as baseHooks } from "../../../core/vdom/modules";

export const hook = {
  [Hooks.Create]: [updateDOMListeners, updateDomProps].concat(
    baseHooks[Hooks.Create]
  ),
  [Hooks.Update]: [updateDOMListeners, updateDomProps].concat(
    baseHooks[Hooks.Update]
  )
};

export default {
  hook
};
