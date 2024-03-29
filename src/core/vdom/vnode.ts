import { IVNode, IVNodeData } from "../../@types/vnode";
import { vueComponent } from "../../@types/vue";

export default class VNode implements IVNode {
  public elm;
  public isComment;
  public componentOptions;
  public context: vueComponent;
  isComponent: boolean = false;

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

export function createEmptyVNode(text?: string) {
  const node = new VNode();
  node.text = text;
  node.isComment = true;
  return node;
}

export function createUseLessVNode() {
  return new VNode("", {}, []);
}
