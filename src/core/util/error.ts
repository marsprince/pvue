import { isPromise } from "../../shared/utils";

const handleError = (e, vm, info) => {};
export function invokeWithErrorHandling(
  handler: Function,
  context: any,
  args: null | any[] | IArguments,
  vm: any,
  info: string
) {
  let res;
  try {
    res = args ? handler.apply(context, args) : handler.call(context);
    if (isPromise(res)) {
      res.catch(e => handleError(e, vm, info + ` (Promise/async)`));
    }
  } catch (e) {
    handleError(e, vm, info);
  }
  return res;
}
