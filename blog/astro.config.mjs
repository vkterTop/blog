import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',
  site: 'https://huanghanxuetang.example.com',
  build: {
    format: 'directory',
  },
  integrations: [tailwind()],
});
