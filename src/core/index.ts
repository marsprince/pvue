import {
  installPlatformConfig,
  installPlatformFunction
} from "../platforms/install";

import { installRenderHelpers } from "./helpers";
import { IVNodeData, IVNode } from "../@types/vnode";
import { createElement } from "../vdom/createElement";

class Vue {
  // 合并后的options
  $options: any = {};
  // dom节点
  $el: any;
  // 当前节点对应的vnode
  _vnode: IVNode;

  constructor(options: object) {
    this._init(options);
  }

  _init(options: object) {
    // 复杂的合并规则
    this.$options = options;
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
}

// 安装一些render需要的别名
installRenderHelpers(Vue.prototype);
// 安装一些平台相关的设置
installPlatformConfig(Vue);
// 安装一些平台相关的方法
installPlatformFunction(Vue.prototype);

export { Vue };
