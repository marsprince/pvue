import { Vue } from "../core";

export interface IVNode {
  tag?: string;
  data?: IVNodeData;
  children?: Array<IVNode>;
  text?: string;
  // 节点对应的vue组件
  context?: Vue;
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
}

export interface IVNodeData {
  hook?: any;
  on?: { [key: string]: Function | Array<Function> };
}

export interface IComponentOptions {
  Ctor?: any;
  // 组件的事件
  listeners?: any;
}
