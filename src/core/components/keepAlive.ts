import { IVNode } from "../../@types/vnode";
import { getFirstComponentChild } from "../vdom/helpers";
import { remove, isUndef } from "../../shared/utils";

function pruneCacheEntry(
  cache: any,
  key: string,
  keys: Array<string>,
  current?: IVNode
) {
  const cached = cache[key];
  if (cached && (!current || cached.tag !== current.tag)) {
    cached.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

// 抽象组件keepAlive，和平台无关
export default {
  name: "keep-alive",
  abstract: true,
  created() {
    // 这里是keu => vnode 映射
    this.cache = {};
    // 这里是做缓存策略的
    this.keys = [];
  },
  props: {
    max: [String, Number]
  },
  render() {
    // keep-alive只能作用于默认作用于插槽下的第一个组件节点,因此一般都是结合router-view使用
    const slot = this.$slots.default;
    const vnode: IVNode = getFirstComponentChild(slot);
    const componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // 获得组件名字
      // TODO:根据组件名进行一些exclude和include
      const { cache, keys } = this;
      const key: string | number = isUndef(vnode.key)
        ? // same constructor may get registered as different local components
          // so cid alone is not enough (#3269)
          componentOptions.Ctor.cid +
          (componentOptions.tag ? `::${componentOptions.tag}` : "")
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0]);
  }
};
