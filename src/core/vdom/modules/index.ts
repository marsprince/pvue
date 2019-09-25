import { updateDirectives } from "./directives";
import { IModuleHooks } from "../../../@types/hooks";
import ref from "./ref";

export const hook: IModuleHooks = {
  create: [updateDirectives, ref.create],
  update: [updateDirectives, ref.update],
  destroy: [ref.destroy]
};

export default {
  hook
};
