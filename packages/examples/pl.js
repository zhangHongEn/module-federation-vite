import {createFilter} from '@rollup/pluginutils';
const filter = createFilter()

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
  return {
    name: "module-federation-vite",
    enforce: "post",
    config(options, c) {
      return options
    },
    async transform(code, id) {
      if (!filter(id)) return
      // console.log(123123, id)
      // if (id.indexOf("__mfshare__") === -1) {
        if (id.indexOf("__overrideModule__sharedvue") > -1 || id.indexOf("__overrideModule__=0") > -1) {
          console.log("shared", id)
        // if (id.indexOf(".vite/deps/vue.js") > -1 || /(node\_modules[^/]*\/vue\/)|(node_modules[^/]*\/vue\@[\/]+)/.test(id)) {
          return wrapShare()
        // }
      }
      if (id.indexOf("remote2") > -1 || id.indexOf("?a=2") > -1) {
        console.log("remote", id)
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
