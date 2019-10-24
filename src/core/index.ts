import {
  installPlatformConfig,
  installPlatformFunction
} from "../platforms/install";

import { installRenderHelpers } from "./helpers";
import { IVNodeData, IVNode } from "../@types/vnode";
import { createElement } from "./vdom/createElement";
import { markStatic } from "./vdom/static";
import {
  initMethods,
  initData,
  initComputed,
  initWatch,
  initVueEvents,
  initProps,
  initLifecycle,
  initRender
} from "./init/initVueInstance";
import { nextTick } from "./util/nextTick";
import { callHook } from "./instance/lifeCycle";
import { initVueConfig } from "./init/initVueConstructor";
import { mergeOptions } from "./util/options";
import { Watcher } from "./observer/watcher";
import {
  extend,
  component,
  set,
  watch,
  destroy,
  forceUpdate,
  on,
  emit,
  off,
  once,
  mixin,
  filter,
  del,
  use,
  observable,
  directive
} from "./methods/index";

import { initInternalComponent } from "./init/util";
import { setActiveInstance } from "./instance/lifeCycle";
import { currentRenderingInstance } from "./instance/renderHelper";
import { ComponentOptions } from "../@types/vue";

export class Vue {
  // instance props

  // 合并后的options,只保留最原始的输入，没有任何响应式的东西
  $options: any = {};
  // dom节点
  $el: any;
  // vue是由组件构成的，因此每一个vue组件，存在两个节点，组件节点和真实节点
  // 真实节点：有组件创建
  _vnode: IVNode;
  // 组件节点：由组件的父组件创建，通过$options带进来
  $vnode: IVNode;
  // data函数返回的data
  _data: object = {};
  $data: object = {};
  // computedWatcher
  _computedWatchers: any;
  // renderWatcher
  _watcher: Watcher = null;
  // allWatcher
  _watchers: Array<Watcher> = [];
  _isDestroyed: boolean = false;
  _isBeingDestroyed: boolean = false;
  // 是否包含类似 hook: updated 的事件，如果不包含的话，在callHook的时候就不会emit对应事件
  _hasHookEvent: false;
  _events: any = {};
  // props的代理
  _props = {};
  // 父子关系
  $parent: Vue = null;
  $children: Array<Vue> = [];
  $refs: object = {};
  $slots: any;
  $scopedSlots: any;
  $props: any;
  $root: Vue;

  // static props

  //全局的options,用来挂全局的ASSET_TYPES = [
  //'component',
  //'directive',
  //'filter'
  //]
  // 会和每个组件进行merge
  static options: ComponentOptions = {
    components: {},
    directives: {},
    filters: Object.create(null)
  };
  // 静态config对象
  static config: any = {};
  // cid
  static cid = 0;
  // 安装的插件
  static _installedPlugins = [];

  constructor(options: ComponentOptions) {
    this._init(options);
  }

  _init(options: ComponentOptions) {
    // 如果是组件，因为在extend的时候已经执行了mergeOptions，不用重复合并
    if (options && options._isComponent) {
      initInternalComponent(this, options);
    } else {
      // 复杂的合并规则
      this.$options = mergeOptions(
        (this.constructor as any).options,
        options || {},
        this
      );
    }
    initLifecycle(this);
    initVueEvents(this);
    initRender(this);

    // beforeCreate，这时候是把vue自身的东西挂载完毕
    callHook(this, "beforeCreate");
    this._initOptions();
    callHook(this, "created");
    // 如果有el自动进入挂载流程
    if (this.$options.el) {
      this.$mount(this.$options.el);
    }
  }

  _initOptions() {
    // 初始化方法
    initMethods(this);
    // 初始化data
    initData(this);
    // 初始化computed
    initComputed(this);
    initWatch(this);
    /// 初始化Props
    initProps(this);
  }

  // 将vnode渲染并挂载
  _update(vnode: IVNode) {
    const restoreActiveInstance = setActiveInstance(this);
    if (this._vnode) {
      // 如果有
      this.$el = this.__patch__(this._vnode, vnode);
    } else {
      // 如果没有
      this.$el = this.__patch__(this.$el, vnode);
    }
    restoreActiveInstance();
    this._vnode = vnode;
  }

  // 调用render方法，把实例渲染成一个虚拟 Node，
  _render() {
    //_parentVnode 父组件创建的组件节点
    const { render, _parentVnode } = this.$options;
    currentRenderingInstance = this;
    const vnode = render.call(this, this.$createElement);
    currentRenderingInstance = null;
    vnode.parent = _parentVnode;
    return vnode;
  }

  // 返回一个vnode
  $createElement(
    tag?: string,
    data?: IVNodeData,
    children?: Array<IVNodeData>,
    normalizationType?: any,
    alwaysNormalize = true
  ): IVNode {
    // 如果data是一个数组，这时候相当于没有data，其他东西要前移以为
    if (Array.isArray(data)) {
      normalizationType = children;
      children = data;
      data = undefined;
    }
    if (alwaysNormalize) {
      normalizationType = 2;
    }
    return createElement.call(this, tag, data, children, normalizationType);
  }

  _c(a, b, c, d) {
    return this.$createElement(a, b, c, d, false);
  }

  $mount: Function;
  __patch__: Function;

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
  // static method
  static nextTick = nextTick;
  static extend = extend;
  static component = component;
  // $set
  // 向响应式对象中添加一个属性，并确保这个新属性同样是响应式的，且触发视图更新。
  static set = set;
  static delete = del;
  static mixin = mixin;
  static filter = filter;
  static use = use;
  static observable = observable;
  static directive = directive;

  // instance method
  public $nextTick = nextTick.bind(this);
  public $watch = watch.bind(this);
  public $destroy = destroy.bind(this);
  public $forceUpdate = forceUpdate.bind(this);
  public $set = set;
  public $delete = del;
  public $on = on.bind(this);
  public $emit = emit.bind(this);
  public $off = off.bind(this);
  public $once = once.bind(this);
}
export class runtimeVue extends Vue {}
export class templateVue extends Vue {}
// 安装Vue.config上的一些默认值
initVueConfig(Vue);
// 安装一些render需要的别名
installRenderHelpers(Vue.prototype);
// 安装一些平台相关的设置
installPlatformConfig(Vue);

// 安装两个版本的vue
installPlatformFunction(runtimeVue.prototype, true);
installPlatformFunction(templateVue.prototype);

// VUE组件和vue的异同
// 不接受el
// data只能是函数
// 会进行缓存
// 拥有独立的options
// 动态继承
export function VueComponent(vue) {
  class vueComponent extends vue {
    static super: typeof vue;
  }
  return vueComponent;
}
