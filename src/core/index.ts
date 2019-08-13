import {
  installPlatformConfig,
  installPlatformFunction
} from "../platforms/install";

import { installRenderHelpers } from "./helpers";
import { IVNodeData, IVNode } from "../@types/vnode";
import { createElement } from "./vdom/createElement";
import { markStatic } from "./vdom/static";
import { initMethods, initData } from "./init";

class Vue {
  // 合并后的options,只保留最原始的输入，没有任何响应式的东西
  $options: any = {};
  // dom节点
  $el: any;
  // 当前组件对应的vnode
  _vnode: IVNode;
  // data函数返回的data
  _data: object;

  constructor(options: object) {
    this._init(options);
  }

  _init(options: object) {
    // 复杂的合并规则
    this.$options = options || {};
    // 初始化方法
    initMethods(this);
    // 初始化data
    initData(this);
  }

  // 将vnode渲染并挂载
  _update(vnode: IVNode) {
    if (this._vnode) {
      // 如果有
      this.$el = this.__patch__(this._vnode, vnode);
    } else {
      // 如果没有
      this.$el = this.__patch__(this.$el, vnode);
    }
    this._vnode = vnode;
  }

  // 调用render方法，把实例渲染成一个虚拟 Node，
  _render() {
    return this.$options.render.call(this);
  }

  // 返回一个vnode
  $createElement(
    tag?: string,
    data?: IVNodeData,
    children?: Array<IVNodeData>
  ): IVNode {
    if (Array.isArray(data)) {
      children = data;
      data = undefined;
    }
    return createElement.call(this, tag, data, children);
  }

  $mount: Function;
  __patch__: Function;
  // 静态对象
  static config: any = {};

  // 静态树与静态渲染
  _staticTrees: null | any;
  renderStatic(index: number, isInFor: boolean) {
    const cached = this._staticTrees || (this._staticTrees = []);
    let tree = cached[index];
    // if has already-rendered static tree and not inside v-for,
    // we can reuse the same tree.
    if (tree && !isInFor) {
      return tree;
    }
    tree = cached[index] = this.$options.staticRenderFns[index].call(this);
    markStatic(tree, `__static__${index}`);
    return tree;
  }
}

// 安装一些render需要的别名
installRenderHelpers(Vue.prototype);
// 安装一些平台相关的设置
installPlatformConfig(Vue);
// 安装一些平台相关的方法
installPlatformFunction(Vue.prototype);

export { Vue };
