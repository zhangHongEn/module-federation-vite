// vite.config.js
import { defineConfig } from "file:///Users/zhanghongen/Desktop/zwork/open-code/module-federation-vite/node_modules/.pnpm/vite@5.3.4/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/zhanghongen/Desktop/zwork/open-code/module-federation-vite/node_modules/.pnpm/@vitejs+plugin-vue@5.0.5_vite@5.3.4_vue@3.4.33_typescript@5.5.3_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import fe from "file:///Users/zhanghongen/Desktop/zwork/open-code/module-federation-vite/packages/module-federation-vite/src/index.js";
import topLevelAwait from "file:///Users/zhanghongen/Desktop/zwork/open-code/module-federation-vite/node_modules/.pnpm/vite-plugin-top-level-await@1.4.2_rollup@4.18.1_vite@5.3.4/node_modules/vite-plugin-top-level-await/exports/import.mjs";
console.log(123, fe);
var vite_config_default = defineConfig({
  resolve: {
    alias: []
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {}
      }
    }
  },
  optimizeDeps: {},
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
        vue: {},
        react: {
          requiredVersion: "18"
        }
      }
    }),
    topLevelAwait()
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvemhhbmdob25nZW4vRGVza3RvcC96d29yay9vcGVuLWNvZGUvbW9kdWxlLWZlZGVyYXRpb24tdml0ZS9wYWNrYWdlcy9leGFtcGxlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3poYW5naG9uZ2VuL0Rlc2t0b3Avendvcmsvb3Blbi1jb2RlL21vZHVsZS1mZWRlcmF0aW9uLXZpdGUvcGFja2FnZXMvZXhhbXBsZXMvdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3poYW5naG9uZ2VuL0Rlc2t0b3Avendvcmsvb3Blbi1jb2RlL21vZHVsZS1mZWRlcmF0aW9uLXZpdGUvcGFja2FnZXMvZXhhbXBsZXMvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgZmUgZnJvbSBcIm1vZHVsZS1mZWRlcmF0aW9uLXZpdGVcIlxuaW1wb3J0IHRvcExldmVsQXdhaXQgZnJvbSBcInZpdGUtcGx1Z2luLXRvcC1sZXZlbC1hd2FpdFwiO1xuY29uc29sZS5sb2coMTIzLCBmZSlcblxuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IFtcbiAgICAgIF1cbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgdnVlKCksXG4gICAgZmUoe1xuICAgICAgbmFtZTogXCJiYlwiLFxuICAgICAgcmVtb3Rlczoge1xuICAgICAgICByZW1vdGUxOiBcIm1mYXBwMDFAaHR0cHM6Ly91bnBrZy5jb20vbWYtYXBwLTAxQDEuMC45L2Rpc3QvcmVtb3RlRW50cnkuanNcIixcbiAgICAgICAgcmVtb3RlMjogXCJtZmFwcDAyQGh0dHBzOi8vdW5wa2cuY29tL21mLWFwcC0wMi9kaXN0L3JlbW90ZUVudHJ5LmpzXCIsXG4gICAgICAgIHJlbW90ZTM6IFwicmVtb3RlMUBodHRwczovL3VucGtnLmNvbS9yZWFjdC1tYW5pZmVzdC1leGFtcGxlX3JlbW90ZTFAMS4wLjYvZGlzdC9tZi1tYW5pZmVzdC5qc29uXCJcbiAgICAgIH0sXG4gICAgICBleHBvc2VzOiB7XG4gICAgICAgIFwiQXBwXCI6IFwiLi9zcmMvQXBwLnZ1ZVwiXG4gICAgICB9LFxuICAgICAgZmlsZW5hbWU6IFwiZGQvcmVtb3RlRW50cnkuanNcIixcbiAgICAgIHNoYXJlZDoge1xuICAgICAgICB2dWU6IHtcbiAgICAgICAgfSxcbiAgICAgICAgcmVhY3Q6IHtcbiAgICAgICAgICByZXF1aXJlZFZlcnNpb246IFwiMThcIlxuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0pLFxuICAgIHRvcExldmVsQXdhaXQoKSxcbiAgXSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTJhLFNBQVMsb0JBQW9CO0FBQ3hjLE9BQU8sU0FBUztBQUNoQixPQUFPLFFBQVE7QUFDZixPQUFPLG1CQUFtQjtBQUMxQixRQUFRLElBQUksS0FBSyxFQUFFO0FBSW5CLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNMLE9BQU8sQ0FDUDtBQUFBLEVBQ0o7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGNBQWMsQ0FFZDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsY0FBYyxDQUNkO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFDSixHQUFHO0FBQUEsTUFDRCxNQUFNO0FBQUEsTUFDTixTQUFTO0FBQUEsUUFDUCxTQUFTO0FBQUEsUUFDVCxTQUFTO0FBQUEsUUFDVCxTQUFTO0FBQUEsTUFDWDtBQUFBLE1BQ0EsU0FBUztBQUFBLFFBQ1AsT0FBTztBQUFBLE1BQ1Q7QUFBQSxNQUNBLFVBQVU7QUFBQSxNQUNWLFFBQVE7QUFBQSxRQUNOLEtBQUssQ0FDTDtBQUFBLFFBQ0EsT0FBTztBQUFBLFVBQ0wsaUJBQWlCO0FBQUEsUUFDbkI7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxjQUFjO0FBQUEsRUFDaEI7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
