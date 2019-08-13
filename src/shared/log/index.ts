export function warn(msg: string) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(msg);
  }
}
