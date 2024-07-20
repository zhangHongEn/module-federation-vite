import {createFilter} from '@rollup/pluginutils';
import {normalizeModuleFederationOptions} from "/Users/zhanghongen/Desktop/zwork/open-code/module-federation-vite/packages/module-federation-vite/src/utils/normalizeModuleFederationOptions.js"
const filter = createFilter()
// name: string;
//     version?: string;
//     buildVersion?: string;
//     entry: string;
//     type: RemoteEntryType;
//     entryGlobalName: string;
//     shareScope: string;

function wrapShare(id) {
      return {
        code: `
      const vue = await import("${'vue'}")
      console.log("开始加载shared vue")
      await new Promise(res => setTimeout(res, 1000))
      export default vue
      `,map: null,
      syntheticNamedExports: true
      }
}

export default function federation(
  options
) {
  let remotes = {
    remote1: "mfapp01@https://unpkg.com/mf-app-01@1.0.9/dist/remoteEntry.js",
    remote2: "mfapp02@https://unpkg.com/mf-app-02/dist/remoteEntry.js"
  }
  options = normalizeModuleFederationOptions({
    remotes
  })
  remotes = options.remotes
  const alias = []
  remotes.forEach(remote => {
    alias.push({
      find: new RegExp(`(${remote.name}(\/.*|$)?)`),
      replacement: "$1",
      customResolver(source) {
        return this.resolve("vite-plugin-override-module-empty?__overrideModule__=" + encodeURIComponent(source))
      }
    })
  })
  const remotePrefixList = remotes.map(item => item.name)
  return {
    name: "module-federation-vite",
    enforce: "post",
    config(config) {
      config.resolve.alias.push(...alias)
      console.log(123213312, config.resolve.alias)
    },
    async transform(code, id) {
      if (!filter(id)) return
      // console.log(123123, id)
      // if (id.indexOf("__mfshare__") === -1) {
        if (id.indexOf("__overrideModule__sharedvue") > -1 || id.indexOf("__overrideModule__=" + decodeURIComponent("sharedvue")) > -1) {
          console.log(333, "shared", id)
        // if (id.indexOf(".vite/deps/vue.js") > -1 || /(node\_modules[^/]*\/vue\/)|(node_modules[^/]*\/vue\@[\/]+)/.test(id)) {
          return wrapShare()
        // }
      }
      let [devRemoteModuleName] = id.match(new RegExp(`\.vite\/deps\/(${remotePrefixList.join("|")})(\_.*\.js|\.js)`)) || []
      if (devRemoteModuleName || id.indexOf(decodeURIComponent("__overrideModule__=remote2")) > -1) {
        let [prodName] =  id.match(/\_\_overrideModule\_\_=[^&]/) || []
        const moduleName = prodName || devRemoteModuleName.replace(".vite/deps/", "").replace(/_/g, "/").replace(".js", "")
        console.log(444, "remote", moduleName,)
        // return
        return {
          code: `
        import {init, loadRemote} from "@module-federation/enhanced/runtime"
        ${remotes.map(remote => {
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
          console.log(1111111, "${moduleName}")
        export default await loadRemote(${JSON.stringify(moduleName)})
        `,map: null,
        syntheticNamedExports: true
        }
      }
    },
  }
}
