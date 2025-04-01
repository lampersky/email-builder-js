import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react-swc';

export default defineConfig({
    plugins: [react()],
    base: '/email-builder-js/',
    build: {
      lib: {
        entry: 'src/emailbuilder.component.jsx',
        name: 'EmailBuilderJsComponent',
        fileName: (format) => `email-builder-js-component.${format}.js`,
        formats: ['iife'],
      },
      rollupOptions: {
        external: [
          'react', 
          'react-dom',
          ],
        output: {
          globals: {
            react: 'React', 
            'react-dom': 'ReactDOM'
          },
        },
      },
    },
    define: {
      'process.env': process.env
    }
  }
);