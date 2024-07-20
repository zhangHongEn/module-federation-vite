import {createFilter} from '@rollup/pluginutils';
const filter = createFilter([/.js/])
let moduleIndex = 0


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
  const remotes = ["remote2", "remote3"]
  const alias = {}
  remotes.forEach((key) => {
    // matchMap[] = moduleIndex
    alias["__moduleFederation__" + override[key]] = `vite-plugin-override-module-empty?__overrideModule__=${encodeURIComponent(key)}`
    moduleIndex++
  })
  return {
    name: "module-federation-vite",
    enforce: "post",
    config(config) {
      if (!config.optimizeDeps) config.optimizeDeps = {}
      if (!config.optimizeDeps.needsInterop) config.optimizeDeps.needsInterop = []
      Object.keys(alias).forEach(key => {
        config.optimizeDeps.needsInterop.push(key)
      })
      config.optimizeDeps.needsInterop.push("vite-plugin-override-module-empty")
      Object.assign(config.resolve.alias, alias)
    },
    async transform(code, id) {
      if (!filter(id)) return
      // console.log(123123, id)
      // if (id.indexOf("__mfshare__") === -1) {
        console.log(123123, id)
      if (id.indexOf("__overrideModule__sharedvue") > -1 || id.indexOf("__overrideModule__=0") > -1) {
        // if (id.indexOf(".vite/deps/vue.js") > -1 || /(node\_modules[^/]*\/vue\/)|(node_modules[^/]*\/vue\@[\/]+)/.test(id)) {
          return wrapShare()
        // }
      }
      if (id.indexOf("remote2") > -1 || id.indexOf("?a=2") > -1) {
        console.log(1111, id)
        // return
        return {
          code: `
        import {init, loadRemote} from "@module-federation/enhanced/runtime"
        await init({
          name: '@demo/main-app',
          remotes: [
              {
                name: 'mfapp01',
                type: "var",
                alias: 'mfapp01',
                entry: 'http://unpkg.com/mf-app-01@1.0.9/dist/remoteEntry.js',
              }
          ],
        })
        export default await loadRemote("mfapp01/App")
        `,map: null,
        syntheticNamedExports: true
        }
      }
      if (id.indexOf("remote3") > -1 || id.indexOf("?a=3") > -1) {
        // return
        return {
          code: `
        import {init, loadRemote} from "@module-federation/enhanced/runtime"
        await init({
          name: '@demo/main-app',
          remotes: [
              {
                name: 'mfapp02',
                type: "var",
                alias: 'mfapp02',
                entry: 'http://unpkg.com/mf-app-02/dist/remoteEntry.js',
              }
          ],
        })
        export default await loadRemote("mfapp02/App")
        `,map: null,
        syntheticNamedExports: true
        }
      }
    },
  }
}
