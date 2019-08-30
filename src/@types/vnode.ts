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
}

export interface IVNodeData {
  on?: { [key: string]: Function | Array<Function> };
}
