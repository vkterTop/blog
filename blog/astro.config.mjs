import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',
  site: 'https://vktertop.github.io',
  base: '/blog',
  build: {
    format: 'directory',
  },
  integrations: [tailwind()],
});
