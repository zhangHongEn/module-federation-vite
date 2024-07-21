import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fe from "module-federation-vite"
import topLevelAwait from "vite-plugin-top-level-await";


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
        remote3: "remote1@https://unpkg.com/react-manifest-example_remote1@1.0.6/dist/mf-manifest.json"
      },
      exposes: {
        "App": "./src/App.vue"
      },
      filename: "dd/remoteEntry.js",
      shared: {
        vue: {
        },
        react: {
          requiredVersion: "18"
        }
      },
    }),
    topLevelAwait(),
  ],
})
