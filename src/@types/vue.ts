import { Vue } from "../core/index";
export type vueComponent = Vue;
export interface ComponentOptions {
  // 生命周期
  beforeCreate?(): void;
  created?(): void;
  beforeDestroy?(): void;
  destroyed?(): void;
  beforeMount?(): void;
  mounted?(): void;
  beforeUpdate?(): void;
  updated?(): void;
  activated?(): void;
  deactivated?(): void;
}
