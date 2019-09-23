export function use(plugin: any, ...args) {
  const installedPlugins =
    this._installedPlugins || (this._installedPlugins = []);
  if (installedPlugins.indexOf(plugin) > -1) {
    return this;
  }
  args.unshift(this);
  if (typeof plugin.install === "function") {
    plugin.install.apply(plugin, args);
  } else if (typeof plugin === "function") {
    plugin.apply(null, args);
  }
  installedPlugins.push(plugin);
  return this;
}
