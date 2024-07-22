## 本地预览
``` shell
pnpm install && pnpm run dev
pnpm install && pnpm run build
```

## 用法
``` js
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fe from "module-federation-vite"
import topLevelAwait from "vite-plugin-top-level-await";


// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: "src/main.js"
    },
    terserOptions: {
      mangle: {
        reserved: ["init", "get"]
      }
    }
  },
  plugins: [
    vue(),
    fe({
      name: "bbc",
      remotes: {
        remote1: "mfapp01@https://unpkg.com/mf-app-01@1.0.9/dist/remoteEntry.js",
        remote2: "mfapp02@https://unpkg.com/mf-app-02/dist/remoteEntry.js",
        remote3: "remote1@https://unpkg.com/react-manifest-example_remote1@1.0.6/dist/mf-manifest.json",
        // "remote4": {
        //   entry: "http://localhost:5174/dd/remoteEntry.js",
        //   globalEntryName: "bb",
        //   type: "esm"
        // }
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
```

## 实现原理

#### 代理remote模块
  * 通过alias regexp（/^remote(\/.*|$)?/）
#### 代理shared模块
  * 通过ast重写import, import "vue" --> import "__overrideModule__sharedvue"
#### 代理模块动态export
  * dev时使用optimizeDeps.needsInterop
  * build时使用rollup syntheticNamedExports
#### 同步import远程模块
  * 被代理模块使用top-level-await
  * 不支持的环境使用vite-plugin-top-level-await（参考[@originjs/vite-plugin-federation](https://github.com/originjs/vite-plugin-federation)）
#### 支持各种remote（.json、.js;var、esm等
  * 使用@module-federation/enhanced/runtime
#### vite-plugin-override-module-empty作用
  * 依赖预编译需要有实体文件, 无法使用虚拟模块, 虚拟模块optimizeDeps.needsInterop无法匹配
