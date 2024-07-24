# Vite Plugin For Module Federation

## preview
``` shell
pnpm install && pnpm run dev
pnpm install && pnpm run build
```

## usage
https://module-federation.io/guide/basic/webpack.html

``` js
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import mf from "module-federation-vite"
import topLevelAwait from "vite-plugin-top-level-await";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    mf({
      name: "bbc",
      remotes: {
        mfapp01: "mfapp01@https://unpkg.com/mf-app-01@1.0.9/dist/remoteEntry.js",
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
    // If you set build.target: "chrome89", you can remove this plugin
    // topLevelAwait(),
  ],
  build: {
    target: "chrome89"
  }
})
```

## roadmap
* feat: generate mf-manifest.json
* feat: support chrome plugin
* feat: support runtime plugins
* feat: download remote d.ts
* feat: generate d.ts
* feat: support @vitejs/plugin-legacy

## implementation principle

#### proxy remote module
  * alias regexp（/^remote(\/.*|$)?/）
#### proxy shared module
  * ast change import, import "vue" --> import "__overrideModule__vue"
#### proxy module dynamic export
  * dev mode use optimizeDeps.needsInterop
  * build mode use rollup syntheticNamedExports
#### sync import remote module
  * use top-level-await
  * Incompatible environment using vite-plugin-top-level-await（refer [@originjs/vite-plugin-federation](https://github.com/originjs/vite-plugin-federation)）
#### Supports a wide variety of remote（.json、.js;var、esm ...)
  * use @module-federation/runtime
#### vite-plugin-override-module-empty
  * enforce: "post", Dependency precompilation requires entity files
  * In theory, you can use enforce: "pre" + resolveId + load virtual module instead, The virtual module name cannot contain "":", otherwise optimizeDeps.needsInterop will not match
