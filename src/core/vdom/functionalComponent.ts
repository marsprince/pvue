import { IVNodeData, IVNode } from "../../@types/vnode";
import { vueComponent } from "../../@types/vue";
import { isDef } from "../../shared/utils";

// TODO: more support, only logic
class FunctionalRenderContext {
  data?: IVNodeData;
  props?: any;
  children?: Array<IVNode>;
  parent?: vueComponent;
  _c: any;

  constructor(
    data: IVNodeData,
    props: any,
    children: Array<IVNode>,
    parent: vueComponent,
    Ctor: any
  ) {
    this.data = data;
    this.props = props;
    this.children = children;
    this.parent = parent;
    this._c = (a, b, c, d) => parent.$createElement.call(parent, a, b, c, d);
  }
}

export function createFunctionalComponent(
  Ctor: any,
  propsData: any,
  data: IVNodeData,
  contextVm: vueComponent,
  children: Array<IVNode>
) {
  const options = Ctor.options;
  const props = {};
  const propOptions = options.props;
  if (isDef(propOptions)) {
    for (const key in propOptions) {
      props[key] = propOptions[key];
    }
  }
  // 没有任何响应式， 以最小的代价实现lsit props 等功能
  const renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  const vnode = options.render.call(null, renderContext._c, renderContext);
  return vnode;
}
