// @ts-check
import { defineConfig } from 'astro/config';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standlone',
  }),
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 4321,
    host: true,
  }
  integrations: [
    // Tailwind CSS integration
    (await import('@astrojs/tailwind')).default(),
  ],

  adapter: node({
    mode: 'standalone',
  }),
});
