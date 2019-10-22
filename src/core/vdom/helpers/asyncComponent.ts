import {
  isObject,
  isDef,
  remove,
  isPromise,
  isUndef
} from "../../../shared/utils";
import { currentRenderingInstance } from "../../instance/renderHelper";
import { IVNode, IVNodeData } from "../../../@types/vnode";
import { vueComponent } from "../../../@types/vue";
import { createEmptyVNode } from "../../vdom/vnode";

function ensureCtor(comp: any, base: any, extendCtor?: any) {
  return isObject(comp) ? base.extend(comp, extendCtor) : comp;
}

export function createAsyncPlaceholder(
  factory: Function,
  data: IVNodeData,
  context: vueComponent,
  children?: Array<IVNode>,
  tag?: string
): IVNode {
  const node = createEmptyVNode();
  node.isAsyncPlaceholder = true;
  node.asyncFactory = factory;
  node.asyncMeta = { data, context, children, tag };
  return node;
}

export function resolveAsyncComponent(
  factory: any,
  baseCtor: any,
  extendCtor?: any
) {
  // 分三种情况
  // 1. require
  // Vue.component('async-example', function (resolve, reject) {
  //   // 这个特殊的 require 语法告诉 webpack
  //   // 自动将编译后的代码分割成不同的块，
  //   // 这些块将通过 Ajax 请求自动下载。
  //   // require(['./my-async-component'], resolve)
  // })
  // 2. promise
  // Vue.component(
  //   'async-webpack-example',
  //   // 该 `import` 函数返回一个 `Promise` 对象。
  //   () => import('./my-async-component')
  // )
  // 3.对象
  // const AsyncComp = () => ({
  //   // 需要加载的组件。应当是一个 Promise
  //   component: import('./MyComp.vue'),
  //   // 加载中应当渲染的组件
  //   loading: LoadingComp,
  //   // 出错时渲染的组件
  //   error: ErrorComp,
  //   // 渲染加载中组件前的等待时间。默认：200ms。
  //   delay: 200,
  //   // 最长等待时间。超出此时间则渲染错误组件。默认：Infinity
  //   timeout: 3000
  // })
  // Vue.component('async-example', AsyncComp)
  if (isDef(factory.resolved)) {
    return factory.resolved;
  }
  // 首先，同一个函数可能被使用多次，需要记住对应的vm
  const currentVm = currentRenderingInstance;
  if (currentVm) {
    // vms init
    if (isDef(factory.vms)) {
      factory.vms.indexOf(currentVm) === -1 && factory.vms.push(currentVm);
    } else {
      factory.vms = [currentVm];
    }
    const owners = factory.vms;
    // logic
    if (!factory.inited) {
      factory.inited = true;

      // rerender
      const forceRender = (renderCompleted: boolean) => {
        for (let i = 0, l = owners.length; i < l; i++) {
          owners[i].$forceUpdate();
        }

        // if (renderCompleted) {
        //   owners.length = 0;
        //   if (timerLoading !== null) {
        //     clearTimeout(timerLoading);
        //     timerLoading = null;
        //   }
        //   if (timerTimeout !== null) {
        //     clearTimeout(timerTimeout);
        //     timerTimeout = null;
        //   }
        // }
      };

      // when promise resolve
      const resolve = res => {
        // cache resolved
        factory.resolved = ensureCtor(res, baseCtor, extendCtor);
        forceRender(true);
      };

      // and when reject
      const reject = err => {
        // cache resolved
        // factory.resolved = ensureCtor(res, baseCtor);
      };
      // 订阅删除事件
      currentVm.$on("hook:destroyed", () => remove(factory.vms, currentVm));
      // 获得res
      const res = factory();
      if (isObject(res)) {
        // support 2
        if (isPromise(res)) {
          if (isUndef(factory.resolved)) {
            res.then(resolve, reject);
          }
        } else if (isPromise(res.component)) {
          // suuport 3
          res.component.then(resolve, reject);
          // support loading error timeout, just logic
        }
      }
    }
  }
}
