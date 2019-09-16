import { Vue } from "../core/index";
import { IVNode } from "./vnode";
export type vueComponent = Vue;
export type VueCtor = typeof Vue;
export interface IOptionProps {
  type?: any;
}
export interface ComponentOptions {
  name?: string;
  el?: Element | string;
  props?: any;
  propsData?: any;
  data?: () => object;
  methods?: any;
  computed?: any;
  watch?: any;
  directives?: any;
  filters?: any;
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

  //以下均为vue添加的
  _base?: Vue;
  //extend的缓存
  _Ctor?: any;
  // 父级的事件
  _parentListeners?: any;
  // 是否是一个组件
  _isComponent?: boolean;
  // 当前节点
  _parentVnode?: IVNode;
}
