export function directive(id: string, definition: Function | Object) {
  if (typeof definition === "function") {
    definition = { bind: definition, update: definition };
  }
  this.options.directives[id] = definition;
}
