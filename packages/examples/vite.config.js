import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fe from "./pl"
import {overrideModule as fe1} from "rollup-plugin-override-module"
import topLevelAwait from "vite-plugin-top-level-await";
import {resolve} from "node:path"



// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
      alias: {
        remote2: 'vite-plugin-override-module-empty?a=2',
        remote3: 'vite-plugin-override-module-empty?a=3',
      }
  },
  build: {
    target: "chrome89",
    rollupOptions: {
      output: {
        manualChunks: {
          "vue": ["vue"]
        }
      }
    }
  },
  optimizeDeps: {
    include: ["@module-federation/enhanced/runtime"],
    needsInterop: ["vite-plugin-override-module-empty"]
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
      override: {
        vue: "sharedvue"
      }
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
    // topLevelAwait({
    //   // The export name of top-level await promise for each chunk module
    //   promiseExportName: "__tla",
    //   // The function to generate import names of top-level await promise in each chunk module
    //   promiseImportName: i => `__tla_${i}`
    // }),
  ],
})
