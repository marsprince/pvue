import { updateDOMListeners } from "./events";
import { Hooks } from "./hooks.enum";

export const hooks = {
  [Hooks.Create]: [updateDOMListeners]
};

export default {
  hooks
};
