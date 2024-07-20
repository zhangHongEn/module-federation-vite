const {createFilter} = require('@rollup/pluginutils');
const {overrideModule} = require("vite-plugin-override-module")
const {normalizeModuleFederationOptions} = require("./utils/normalizeModuleFederationOptions")
const filter = createFilter()

function wrapShare(id) {
  console.log(333, "shared", id)
      return {
        code: `
      const vue = await import(${JSON.stringify(id)})
      console.log("开始加载shared ${id}")
      export default vue
      `,map: null,
      syntheticNamedExports: true
      }
}

function wrapRemote(remotes, id) {
  console.log(444, "remote", id)
  return {
    code: `
  import {init, loadRemote} from "@module-federation/enhanced/runtime"
  ${Object.keys(remotes).map(key => {
    const remote = remotes[key]
    return `
    ;await init({
      name: 'app1',
      remotes: [
          {
            entryGlobalName: ${JSON.stringify(remote.entryGlobalName)},
            name: ${JSON.stringify(remote.name)},
            type: ${JSON.stringify(remote.type)},
            entry: ${JSON.stringify(remote.entry)},
          }
      ],
    });
    `
  }).join(";")}
  export default await loadRemote(${JSON.stringify(id)})
  `,map: null,
  syntheticNamedExports: true
  }
}
module.exports = function federation(
  options
) {
  const {
    remotes,
    shared
  } = normalizeModuleFederationOptions(options)
  const alias = []
  Object.keys(remotes).forEach(key => {
    const remote = remotes[key]
    alias.push({
      find: new RegExp(`(${remote.name}(\/.*|$)?)`),
      replacement: "$1",
      customResolver(source) {
        return this.resolve("vite-plugin-override-module-empty?__overrideModuleRemote__=" + encodeURIComponent(source))
      }
    })
  })
  const remotePrefixList = Object.keys(remotes)
  const sharedKeyList = Object.keys(shared).map(item => `__overrideModule__${item}`)
  return [
    overrideModule({
      override: Object.keys(shared)
    }),
    {
      name: "module-federation-vite",
      enforce: "post",
      config(config) {
        config.resolve.alias.push(...alias)
        if (!config.optimizeDeps.include) config.optimizeDeps.include = []
        config.optimizeDeps.include.push("@module-federation/enhanced/runtime")
        Object.keys(shared).forEach(key => {
          config.build.rollupOptions.output.manualChunks[key] = [key]
        })
      },
      async transform(code, id) {
        if (!filter(id)) return
        let [devSharedModuleName] = id.match(new RegExp(`\.vite\/deps\/(${sharedKeyList.join("|")})(\_.*\.js|\.js)`)) || []
        if (devSharedModuleName) {
          return wrapShare(devSharedModuleName.replace(".vite/deps/__overrideModule__", "").replace(/_/g, "/").replace(".js", ""))
        }
        let [prodSharedName] = id.match(/\_\_overrideModule\_\_=[^&]+/) || []
        if (prodSharedName) {
          return wrapShare(decodeURIComponent(prodSharedName.replace("__overrideModule__=", "")))
        }
        let [devRemoteModuleName] = id.match(new RegExp(`\.vite\/deps\/(${remotePrefixList.join("|")})(\_.*\.js|\.js)`)) || []
        if (devRemoteModuleName) {
          return wrapRemote(remotes,devRemoteModuleName.replace(".vite/deps/", "").replace(/_/g, "/").replace(".js", ""))
        }
        let [prodRemoteName] =  id.match(/\_\_overrideModuleRemote\_\_=[^&]+/) || []
        if (prodRemoteName) {
          return wrapRemote(remotes, decodeURIComponent(prodRemoteName.replace("__overrideModuleRemote__=", "")))
        }
      },
    }
  ]
}
