import {defineConfig} from 'vite';
export default defineConfig({build:{outDir:'dist',rollupOptions:{input:'src/client.mjs',output:{entryFileNames:'client.js'}}}});
