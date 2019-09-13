import { Vue } from "../core/index";
export type vueComponent = Vue;
export interface IVueOptions {
  components?: any;
  directives?: any;
  filters?: any;
  _base?: any;
}
export interface ComponentOptions {
  name?: string;
  el?: Element | string;
  data?: () => object;
  methods?: any;
  computed?: any;
  watch?: any;
  template?: string;
  components?: any;
  // render
  render?: any;
  staticRenderFns?: any;
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

  //vue添加的内部使用
  _Ctor?: any;
}
