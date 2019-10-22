import { IVNode, IVNodeData } from "../../@types/vnode";
import { vueComponent } from "../../@types/vue";
import { isObject, isUndef } from "../../shared/utils";
import VNode from "./vnode";
import { extractPropsFromVNodeData } from "./helpers/extractProp";
import { updateChildComponent } from "../instance/lifeCycle";
import { getActiveInstance } from "../instance/lifeCycle";
import { IComponentHooks } from "../../@types/hooks";
import {
  callHook,
  activateChildComponent,
  deactivateChildComponent
} from "../instance/lifeCycle";

import {
  resolveAsyncComponent,
  createAsyncPlaceholder
} from "./helpers/asyncComponent";

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
  const extendCtor = Object.getPrototypeOf(context).constructor;
  // extend
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor, extendCtor);
  }
  let asyncFactory;
  if (isUndef(Ctor.cid)) {
    // 异步组件进这里
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, extendCtor);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(asyncFactory, data, context, children, tag);
    }
  }
  /**上面为对Cotr的处理*/
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
  },
  insert(vnode: IVNode) {
    // keep-alive一定是组件
    const { context, componentInstance } = vnode;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, "mounted");
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        // queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance /* direct */);
      }
    }
  },
  destroy(vnode) {
    const { componentInstance } = vnode;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance /* direct */);
      }
    }
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
