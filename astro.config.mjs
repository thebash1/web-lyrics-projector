import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
    output: 'server',
    adapter: node({
        mode: 'standalone',
    }),
    server: {
        host: '0.0.0.0',
        port: 4321
    },
    vite: {
        server: {
            allowedHosts: true 
        }
    },
    integrations: [tailwind()],
});
