import { IVNode, IVNodeData } from "../../@types/vnode";

export default class VNode implements IVNode {
  constructor(
    public tag?: string,
    public data?: IVNodeData,
    public children?: Array<IVNode>,
    public text?: string
  ) {}
}

export function createTextVNode(val: string | number) {
  return new VNode(undefined, undefined, undefined, String(val));
}

export function createEmptyNode() {
  return new VNode("", {}, []);
}
