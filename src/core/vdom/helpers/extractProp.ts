import { IVNodeData } from "../../../@types/vnode";
import { VueCtor } from "../../../@types/vue";
import { isUndef, isDef, hasOwn, hyphenate } from "../../../shared/utils";

function checkProp(
  // 检查后需要把Props绑定在res上
  res: Object,
  // props对象
  target?: Object,
  // 从propsOptions里取出来的key
  key?: string,
  // 别名
  altKey?: string,
  // 是否保留
  preserve?: boolean
) {
  if (isDef(target)) {
    if (hasOwn(target, key)) {
      res[key] = target[key];
      return true;
    } else if (hasOwn(target, altKey)) {
      res[key] = target[altKey];
      if (!preserve) {
        delete target[altKey];
      }
      return true;
    }
  }
  return false;
}

// 从data中返回所有props
export function extractPropsFromVNodeData(
  data: IVNodeData,
  Ctor: VueCtor,
  tag?: string
) {
  // 原始的props在ctor里，值在data.attrs里
  // 这里只做赋值，不做检查验证等操作，这些由子组件做
  const propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return;
  }
  const res = {};
  // props可能是绑定在attr或者props上,先从props上拿，再从attrs上拿
  const { attrs, props } = data;
  if (isDef(attrs) || isDef(props)) {
    for (const key in propOptions) {
      const altKey = hyphenate(key);
      checkProp(res, props, key, altKey, true) ||
        checkProp(res, attrs, key, altKey, false);
    }
  }
  return res;
}
