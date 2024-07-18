import {createFilter} from '@rollup/pluginutils';
const filter = createFilter([/.js/])
import url from 'node:url'

const wrapMap = {}
import * as path from "node:path"



function wrapShare(id) {
      return {
        code: `
      const vue = await import("${'vue'}")
      console.log(123123312)
      await new Promise(res => setTimeout(res, 1000))
      console.log(222, vue)
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
    config(options) {
      return options
    },
    async transform(code, id) {
      if (!filter(id)) return
      // console.log(123123, id)
      // if (id.indexOf("__mfshare__") === -1) {
      if (id.indexOf("qwert1") > -1) {
        // console.log(123123, id)
        // if (id.indexOf(".vite/deps/vue.js") > -1 || /(node\_modules[^/]*\/vue\/)|(node_modules[^/]*\/vue\@[\/]+)/.test(id)) {
        console.log(123123, new url.URLSearchParams(id.substr(id.indexOf("?"))).get("mfshare"))
          return wrapShare(new url.URLSearchParams(id.substr(id.indexOf("?"))).get("mfshare"))
        // }
      }
      if (id.indexOf("remote2") > -1 || id.indexOf("?a=2") > -1) {
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
