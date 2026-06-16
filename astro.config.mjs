// @ts-check
import { defineConfig } from 'astro/config';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server',

  integrations: [
    // Tailwind CSS integration
    (await import('@astrojs/tailwind')).default(),
  ],

  adapter: node({
    mode: 'standalone',
  }),
});