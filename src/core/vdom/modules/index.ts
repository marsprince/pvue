import { Hooks } from "./hooks.enum";
import { updateDirectives } from "./directives";

export const hook = {
  [Hooks.Create]: [updateDirectives],
  [Hooks.Update]: [updateDirectives]
};

export default {
  hook
};
