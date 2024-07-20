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
