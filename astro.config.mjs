import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwind from '@astrojs/tailwind'; 
import viteConfig from './vite.config.js';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  vite: viteConfig,
  server: {
    allowedHosts: 'all',
    host: '0.0.0.0',
    port: 4321
  },
  integrations: [tailwind()],
});
