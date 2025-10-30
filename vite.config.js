import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [
    react(),
    svgr(),
  ],
  resolve: {
    alias: {
      src: "/src",
      assets: "/src/assets",
      components: "/src/components",
      context: "/src/context",
      hooks: "/src/hooks",
      pages: "/src/pages",
      tests: "/src/tests",
      config: "/src/config",
      data: "/src/data",
      utils: "/src/utils",
    },
  },
  assetsInclude: ['**/*.xlsx', '**/*.csv', '**/*.tsv'],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup/vitest.setup.ts',
  },
})

