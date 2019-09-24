import { IVNode, IVNodeDirective } from "../../../@types/vnode";
import { emptyNode } from "../patch";
import { resolveAsset } from "../../util/options";
import { mergeVNodeHook } from "../helpers/mergeHook";

function getRawDirName(dir: IVNodeDirective): string {
  return (
    dir.rawName || `${dir.name}.${Object.keys(dir.modifiers || {}).join(".")}`
  );
}

// bind dir obj to  def
function normalizeDirectives(dirs: any, vm) {
  const res = Object.create(null);
  if (!dirs) {
    return res;
  }
  let i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    // if (!dir.modifiers) {
    //   dir.modifiers = emptyModifiers;
    // }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, "directives", dir.name);
  }
  return res;
}

function callHook(dir, hook, vnode, oldVnode, isDestroy = false) {
  const fn = dir.def && dir.def[hook];
  if (fn) {
    try {
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
    } catch (e) {
      // handleError(e, vnode.context, `directive ${dir.name} ${hook} hook`)
    }
  }
}

function _update(oldVnode: IVNode, vnode: IVNode) {
  // 如果是创建节点，那么老节点为空
  // 如果是摧毁节点，那么新节点为空
  // 否则为更新节点
  const isCreate = oldVnode === emptyNode;
  const isDestroy = vnode === emptyNode;
  // 这里是在父组件上获得注册的directive
  const oldDirs = normalizeDirectives(
    oldVnode.data.directives,
    oldVnode.context
  );
  const newDirs = normalizeDirectives(vnode.data.directives, vnode.context);
  const dirsWithInsert = [];
  const dirsWithPostpatch = [];

  let key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      // new directive, bind
      callHook(dir, "bind", vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      dir.oldArg = oldDir.arg;
      callHook(dir, "update", vnode, oldVnode);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }
  if (dirsWithInsert.length) {
    const callInsert = () => {
      for (let i = 0; i < dirsWithInsert.length; i++) {
        callHook(dirsWithInsert[i], "inserted", vnode, oldVnode);
      }
    };
    if (isCreate) {
      // 将钩子函数合并到data上
      mergeVNodeHook(vnode, "insert", callInsert);
    } else {
      callInsert();
    }
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook(oldDirs[key], "unbind", oldVnode, oldVnode, isDestroy);
      }
    }
  }
}

// 在创建和销毁的时候更新directive
export function updateDirectives(oldVnode: IVNode, vnode: IVNode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode);
  }
}
