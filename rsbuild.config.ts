import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  plugins: [pluginReact()],
  html: {
    tags: [
      {
        tag: 'script',
        attrs: {
          src: 'https://cdn.jsdelivr.net/npm/react-scan/dist/auto.global.js',
        },
        append: false,
      },
    ],
  },
});
