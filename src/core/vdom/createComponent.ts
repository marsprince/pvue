import { IVNode, IVNodeData } from "../../@types/vnode";
import { vueComponent } from "../../@types/vue";
import { isObject } from "../../shared/utils";
import VNode from "./vnode";
import { extractPropsFromVNodeData } from "./helpers/extractProp";
import { updateChildComponent } from "../instance/lifeCycle";
import { getActiveInstance } from "../instance/lifeCycle";
import { IComponentHooks } from "../../@types/hooks";

// 所有的组件节点都是从这里创建的
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
  // 从data中解压出propsData，扔到componentOptions上
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
  // 组件节点
  vnode.isComponent = true;
  vnode.context = context;
  return vnode;
}

export function createComponentInstanceForVnode(vnode: IVNode) {
  return new vnode.componentOptions.Ctor({
    _isComponent: true,
    _parentVnode: vnode,
    parent: getActiveInstance()
  });
}
const componentVNodeHooks: IComponentHooks = {
  init(vnode: IVNode) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      // 跳过keep-alive的初始化过程
      componentVNodeHooks.prepatch(vnode, vnode);
    } else {
      const child = (vnode.componentInstance = createComponentInstanceForVnode(
        vnode
      ));
      child.$mount(undefined);
    }
  },
  prepatch(vnode: IVNode, oldVnode: IVNode) {
    // 走到Patch说明是同一个节点，新节点没有走到新建组件的逻辑，直接复用老的即可
    // const options = vnode.componentOptions;
    vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(vnode);
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

export function invokeComponentHook(hook: string, vnode: IVNode, ...args) {
  if (vnode.data && vnode.data.hook && vnode.data.hook[hook]) {
    vnode.data.hook[hook](vnode, ...args);
  }
}
