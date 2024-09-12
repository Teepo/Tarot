import yargs from 'yargs';

import vue from './..vitejs/plugin-vue';
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

import basicSsl from './..vitejs/plugin-basic-ssl';

const argv = yargs(process.argv).argv;

const isHTTPS = argv.https;

const plugins = [
  vue({
    template: {
      transformAssetUrls
    }
  }),
  vuetify({
    autoImport: true
  }),
];

if (isHTTPS) {
  plugins.push(basicSsl());
}

export default defineConfig({
  plugins: plugins,
  define: {
    'process.env': {}
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src',
        import.meta.url))
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    port: 8080,
  },
})
