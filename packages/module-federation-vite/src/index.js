const {createFilter} = require('@rollup/pluginutils');
const {overrideModule} = require("vite-plugin-override-module")
const addEntry = require("vite-plugin-add-entry")
const emptyPath = require.resolve("vite-plugin-override-module-empty")
const {normalizeModuleFederationOptions} = require("./utils/normalizeModuleFederationOptions")
const filter = createFilter()

// version: string;
//     get: SharedGetter;
//     shareConfig: SharedConfig;
//     scope: Array<string>;
//     useIn: Array<string>;
//     from: string;
//     deps: Array<string>;
//     lib?: () => Module;
//     loaded?: boolean;
//     loading?: null | Promise<any>;
//     eager?: boolean;
//     strategy: 'version-first' | 'loaded-first';
function wrapRemoteEntry () {
  return `
  import {init, get} from "__mf__cwdRemoteEntry"
  export {init, get}
  `
}
function wrapHostInit() {
  return `
    import {init, get} from "__mf__cwdRemoteEntry"
    await init()
    `
}
function generateRemoteEntry({remotes, exposes, shared}) {
  return `
  import {init as runtimeInit} from "@module-federation/enhanced/runtime"
  const exposesMap = {
    ${Object.keys(exposes).map(key => {
      return `
      ${key}: () => import(${JSON.stringify(exposes[key].import)})
      `
    }).join(",")}
  }
  async function init() {
    await runtimeInit({
      name: 'app1',
      remotes: [${Object.keys(remotes).map(key => {
          const remote = remotes[key]
          return `
                {
                  entryGlobalName: ${JSON.stringify(remote.entryGlobalName)},
                  name: ${JSON.stringify(remote.name)},
                  type: ${JSON.stringify(remote.type)},
                  entry: ${JSON.stringify(remote.entry)},
                }
          `
        }).join(",")}
      ],
      shared: {
        ${Object.keys(shared).map(key => {
          const shareItem = shared[key]
          return `
            ${key}: {
              name: ${JSON.stringify(shareItem.name)},
              version: ${JSON.stringify("1.0.0" || shareItem.version)},
              scope: ${JSON.stringify(shareItem.scope)},
              loaded: false,
              from: "app1",
              async get () {
                const pkg = await import(${JSON.stringify(key)})
                return function () {
                  return pkg
                }
              },
              shareConfig: {
                singleton: ${shareItem.shareConfig.singleton},
                requiredVersion: ${JSON.stringify(shareItem.shareConfig.requiredVersion)}
              }
            }
          `
        }).join(",")}
      }
    });
    return 1
  }

  function getExposes(moduleName) {
    moduleName = moduleName.replace(/(^\\.\\/)?/, "")
    if (!(moduleName in exposesMap)) throw new Error(\`Module ./\${moduleName} does not exist in container.\`)
    return (exposesMap[moduleName])()
  }
  export {
      init,
      getExposes as get
  }
  `
}

function wrapShare(id) {
  console.log(4444, "share", id)
      return {
        code: `
        import {loadShare} from "@module-federation/enhanced/runtime"
      const res = await loadShare(${JSON.stringify(id)}, {
      requiredVersion: "18"})
      console.log("开始加载shared ${id}")
      export default res()
      `,map: null,
      syntheticNamedExports: true
      }
}

function wrapRemote(id) {
  console.log(444, "remote", id)
  return {
    code: `
    import {loadRemote} from "@module-federation/enhanced/runtime"
  export default await loadRemote(${JSON.stringify(id)})
  `,map: null,
  syntheticNamedExports: true
  }
}
module.exports = function federation(
  options
) {
  options = normalizeModuleFederationOptions(options)
  const {
    remotes,
    shared,
    filename,
  } = options
  let command = ""
  const alias = []
  Object.keys(remotes).forEach(key => {
    const remote = remotes[key]
    alias.push({
      find: new RegExp(`(${remote.name}(\/.*|$)?)`),
      replacement: "$1",
      customResolver(source) {
        return this.resolve("vite-plugin-override-module-empty?__moduleRemote__=" + encodeURIComponent(source))
      }
    }, 
    )
  })
  const remotePrefixList = Object.keys(remotes)
  const sharedKeyList = Object.keys(shared).map(item => `__overrideModule__${item}`)
  return [
    addEntry("remoteEntry", emptyPath + "?__mf__wrapRemoteEntry__", filename),
    addEntry("hostInit", emptyPath + "?__mf__isHostInit", "hostInit.js"),
    overrideModule({
      override: Object.keys(shared)
    }),
    {
      name: "module-federation-vite",
      enforce: "post",
      config(config, {command: _command}) {
        command = _command
        config.resolve.alias.push(...alias)
        if (!config.optimizeDeps.include) config.optimizeDeps.include = []
        config.optimizeDeps.include.push("@module-federation/enhanced/runtime")
        Object.keys(shared).forEach(key => {
          config.optimizeDeps.include.push(key)
          config.build.rollupOptions.output.manualChunks[key] = [key]
        })
        console.log(123123, config.resolve.alias)
      },
      resolveId(id) {
        if (id === "__mf__cwdRemoteEntry") {
          return "__mf__cwdRemoteEntry"
        }
      },
      load(id) {
        if (id === "__mf__cwdRemoteEntry") {
          return generateRemoteEntry(options)
        }
      },
      async transform(code, id) {
        if (!filter(id)) return
        if (id === "__mf__cwdRemoteEntry") {
          // generate remoteEntry.js
          return generateRemoteEntry(options)
        }
        if (id.indexOf("__mf__wrapRemoteEntry__") > -1) {
          // generate remoteEntry.js
          return wrapRemoteEntry()
        }
        if (id.indexOf("__mf__isHostInit") > -1) {
          // generate host auto init
          return wrapHostInit()
        }
        if (id.indexOf("__mf__cwdRemoteEntry") > -1) {
          // generate remoteEntry.js
          return generateRemoteEntry(options, command !== "build")
        }
        let [devSharedModuleName] = id.match(new RegExp(`\.vite\/deps\/(${sharedKeyList.join("|")})(\_.*\.js|\.js)`)) || []
        if (devSharedModuleName) {
          // generate shared
          return wrapShare(devSharedModuleName.replace(".vite/deps/__overrideModule__", "").replace(/_/g, "/").replace(".js", ""))
        }
        let [prodSharedName] = id.match(/\_\_overrideModule\_\_=[^&]+/) || []
        if (prodSharedName) {
          // generate shared
          return wrapShare(decodeURIComponent(prodSharedName.replace("__overrideModule__=", "")))
        }
        let [devRemoteModuleName] = id.match(new RegExp(`\.vite\/deps\/(${remotePrefixList.join("|")})(\_.*\.js|\.js)`)) || []
        if (devRemoteModuleName) {
          // generate remote
          return wrapRemote(devRemoteModuleName.replace(".vite/deps/", "").replace(/_/g, "/").replace(".js", ""))
        }
        let [prodRemoteName] =  id.match(/\_\_moduleRemote\_\_=[^&]+/) || []
        if (prodRemoteName) {
          // generate remote
          return wrapRemote(decodeURIComponent(prodRemoteName.replace("__moduleRemote__=", "")))
        }
      },
    }
  ]
}
