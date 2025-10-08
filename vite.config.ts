import { defineConfig } from 'vite';
import { resolve } from 'path';
// @ts-ignore
import monacoEditorPlugin from 'vite-plugin-monaco-editor';

const monacoPlugin = (monacoEditorPlugin as any).default || monacoEditorPlugin;

export default defineConfig({
  plugins: [
    monacoPlugin({
      languageWorkers: ['json', 'typescript', 'css', 'html'],
      customWorkers: [],
      publicPath: 'monacoeditorwork/',
      globalAPI: false
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'JoltEditor',
      fileName: (format) => format === 'es' ? 'jolt-editor.js' : 'jolt-editor.umd.js',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    },
    sourcemap: true,
    target: 'es2022',
    minify: true,
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true
      }
    }
  },
  server: {
    port: 3000,
    open: true,
    cors: true,
    hmr: {
      overlay: true
    },
    watch: {
      usePolling: false,
      interval: 100
    }
  },
  preview: {
    port: 4173,
    open: true
  },
  optimizeDeps: {
    include: ['lit']
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
});