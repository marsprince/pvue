type hookFunc = Function | Array<Function>;
export interface IComponentHooks {
  init?: hookFunc;
  // 执行时机：组件update之前
  prepatch?: hookFunc;
  // 执行时机：每个patch的最后
  insert?: hookFunc;
  destory?: hookFunc;
}
export interface IModuleHooks {
  // 执行时机：CreateElm的时候
  create?: hookFunc;
  activate?: hookFunc;
  // 执行时机：组件prepatch之后，真正执行update操作之前
  update?: hookFunc;
  remove?: hookFunc;
  destroy?: hookFunc;
}

export interface IRuntimeHooks {
  // 执行时机：每个patch的最后
  insert?: hookFunc;
  // 执行时机，每个patchVnode的最后
  postPatch?: hookFunc;
}

export type IHooks = IComponentHooks | IModuleHooks | IRuntimeHooks;
