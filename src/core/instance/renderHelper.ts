import { resolveAsset } from "../util/options";

export function resolveFilter(id: string) {
  return resolveAsset(this.$options, "filters", id);
}
