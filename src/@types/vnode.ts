import { Vue } from "../core";

export interface IVNode {
  tag?: string;
  data?: IVNodeData;
  children?: Array<IVNode>;
  text?: string;
  context?: Vue;
  // vnode对应的真实节点
  elm?: any;
}

export interface IVNodeData {}
