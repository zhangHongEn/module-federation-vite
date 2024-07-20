import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fe from "module-federation-vite"
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
    fe({
      name: "bb",
      remotes: {
        remote1: "mfapp01@https://unpkg.com/mf-app-01@1.0.9/dist/remoteEntry.js",
        remote2: "mfapp02@https://unpkg.com/mf-app-02/dist/remoteEntry.js",
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
