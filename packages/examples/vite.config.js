import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fe from "module-federation-vite"
import {overrideModule as fe1} from "vite-plugin-override-module"
import topLevelAwait from "vite-plugin-top-level-await";
console.log(123, fe)


// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
      alias: [
      ]
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          
        }
      }
    }
  },
  optimizeDeps: {
  },
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
    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: "__tla",
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: i => `__tla_${i}`
    }),
  ],
})
