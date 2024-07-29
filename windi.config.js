// windi.config.js
import { defineConfig } from 'windicss/helpers';

export default defineConfig({
  extract: {
    include: ['src/**/*.{html,js,jsx,ts,tsx,vue}'],
    exclude: ['node_modules', '.git'],
  },
  // Add custom WindiCSS configuration here
});