import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fe from "./pl"
import fe1 from "./pl1"
import topLevelAwait from "vite-plugin-top-level-await";
import {resolve} from "node:path"



// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
      alias:         [
        {find: "@", replacement: "src"},
        {find: "remote2", replacement: ("module-federation-vite/qwert.js?a=2")},
        {find: "remote3", replacement: "module-federation-vite/qwert.js?a=3"},
        // {find: "react", async customResolver(r,d ,e) {
        //   // if (d.indexOf("qwert1.js?a=vue") > -1) {
        //   //   const {id} = await this.resolve("vue", d, e)
        //   //   return id
        //   // }
        //   const {id} = await this.resolve("@chagee/module-federation-vite/src/qwert1.js", d, e)
        //     return id
        // }},
        // {find: "@chagee/module-federation-vite/src/qwert1.js", replacement: "vue", customResolver(r,d ,e) {
        //   console.log(123123, r,d)
        //   // if (d.indexOf("qwert1.js?a=vue") > -1) {
        //   //   const {id} = await this.resolve("vue", d, e)
        //   //   return id
        //   // }
        //   // const {id} = await this.resolve("@chagee/module-federation-vite/src/qwert1.js", d, e)
        //   //   return id
        // }},
      ],
  },
  optimizeDeps: {
    include: ["@module-federation/enhanced/runtime", "react"],
    needsInterop: ["module-federation-vite/qwert.js", "module-federation-vite/qwert1.js", "module-federation-vite/qwert1.js?mfshare=vue", "module-federation-vite/qwert1.js?mfshare=react"]
  },
  // build: {
  //   commonjsOptions: {
  //     include: [/.*/]
  //   }
  // },
  // optimizeDeps: {
  //   esbuildOptions: {
  //     plugins: [f({
  //       name: "bb",
  //       remotes: {
  //         "remote": {
  //           external: "http://localhost:5173/dist/remoteEntry.js",
  //           format: "var"
  //         }
  //       },
  //       filename: "remoteEntry.js",
  //       shared: {
  //         vue: {},
  //         react: {}
  //       },
  //     })]
  //   }
  // },
  plugins: [
    vue(),
    fe1({
      targets: ['vue']
    }),
    fe({
      name: "bb",
      remotes: {
        "remote": {
          external: "http://localhost:5173/dist/remoteEntry.js",
          format: "var"
        }
      },
      filename: "remoteEntry.js",
      shared: {
        vue: {},
        react: {}
      },
    }),
    // cn(),
    // c(),
    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: "__tla",
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: i => `__tla_${i}`
    }),
  ],
})
