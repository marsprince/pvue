import { vueComponent } from "./vue";
import { IHooks } from "./hooks";

export interface IVNode {
  tag?: string;
  data?: IVNodeData;
  children?: Array<IVNode>;
  text?: string;
  // 节点对应的vue组件
  context?: vueComponent;
  fnContext?: any;
  // vnode对应的真实节点
  elm?: Node;
  // 是否是静态节点（即编译出来完全没有变量）
  isStatic?: boolean;
  key?: string | number;
  isOnce?: boolean;
  // 是否是注释
  isComment?: boolean;
  // 组件参数
  componentOptions?: any;
  // 组件实例
  componentInstance?: any;
  isComponent: boolean;
  parent?: IVNode;
}

export interface IVNodeData {
  props?: any;
  hook?: IHooks;
  on?: { [key: string]: Function | Array<Function> };
  attrs?: any;
  directives?: any;
  ref?: string;
  // ref在for循环中
  refInFor?: boolean;
  slot?: any;
}

export interface IComponentOptions {
  Ctor?: any;
  // 组件的事件
  listeners?: any;
}

export interface IVNodeDirective {
  // 在组件里声明的名称。也是$options里的
  name?: string;
  rawName?: string;
  value?: any;
  oldValue?: any;
}

export type ScopedSlotsData = Array<{ key: string; fn: Function }>;
