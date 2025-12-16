import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import manifest from './manifest.json';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    crx({ manifest }),
    {
      name: 'copy-content-css',
      writeBundle() {
        // Copy content script CSS to dist
        const src = resolve(__dirname, 'src/content/styles.css');
        const destDir = resolve(__dirname, 'dist/src/content');
        const dest = resolve(destDir, 'styles.css');

        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
        fs.copyFileSync(src, dest);
      }
    }
  ],
  build: {
    rollupOptions: {
      input: {
        popup: 'src/popup/popup.html',
      },
    },
  },
});
