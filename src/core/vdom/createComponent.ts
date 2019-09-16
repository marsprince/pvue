import { IVNode, IVNodeData } from "../../@types/vnode";
import { vueComponent } from "../../@types/vue";
import { isObject } from "../../shared/utils";
import VNode from "./vnode";
import { extractPropsFromVNodeData } from "./helpers/extractProp";

export function createComponent(
  // 构造函数，可以是对象，构造函数等
  Ctor: any,
  // 父节点
  context: vueComponent,
  data: IVNodeData = {},
  children?: Array<IVNode>,
  tag?: string
): IVNode {
  const baseCtor = context.$options._base;
  // extend
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor, Object.getPrototypeOf(context).constructor);
  }
  const name = Ctor.options.name || tag;
  // extract props and to child
  const propsData = extractPropsFromVNodeData(data, Ctor, tag);
  // 自定义事件
  const listeners = data.on;
  installComponentHooks(data);

  const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ""}`,
    data
  );
  vnode.componentOptions = {
    Ctor,
    tag,
    children,
    propsData,
    listeners
  };
  vnode.isComponent = true;
  return vnode;
}

export function createComponentInstanceForVnode(vnode: IVNode) {
  return new vnode.componentOptions.Ctor({
    _isComponent: true,
    _parentVnode: vnode
  });
}
const componentVNodeHooks = {
  init(vnode: IVNode) {
    const child = (vnode.componentInstance = createComponentInstanceForVnode(
      vnode
    ));
    child.$mount(undefined);
  }
};
const hooksToMerge = Object.keys(componentVNodeHooks);
// 安装组件的各种钩子
function installComponentHooks(data: IVNodeData) {
  const hooks = data.hook || (data.hook = {});
  for (let i = 0; i < hooksToMerge.length; i++) {
    const key = hooksToMerge[i];
    hooks[key] = componentVNodeHooks[key];
  }
}
