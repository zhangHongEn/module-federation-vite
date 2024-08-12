import { federation } from '@module-federation/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import topLevelAwait from 'vite-plugin-top-level-await';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    open: true,
    port: 5175,
  },
  // base: 'http://localhost:5175',
  plugins: [
    react(),
    federation({
      name: 'viteViteHost',
      remotes: {
        mfapp01: 'mfapp01@https://unpkg.com/mf-app-01@1.0.11/dist/remoteEntry.js',
        remote2: 'mfapp02@https://unpkg.com/mf-app-02/dist/remoteEntry.js',
        remote3:
          'remote1@https://unpkg.com/react-manifest-example_remote1@1.0.6/dist/mf-manifest.json',
        '@namespace/viteViteRemote': {
          entry: 'http://localhost:5176/remoteEntry.js',
          type: 'module',
        },
      },
      filename: 'remoteEntry.js',
      shared: {
        vue: {},
        react: {
          requiredVersion: '18',
        },
        'react-dom': {},
      },
      runtimePlugins: ['./src/mfPlugins'],
    }),
    // If you set build.target: "chrome89", you can remove this plugin
    false && topLevelAwait(),
  ],
  build: {
    target: 'chrome89',
  },
});
