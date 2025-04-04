import { defineConfig } from 'vite';
import copy from 'rollup-plugin-copy';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }) => {
  switch(mode) {
    case 'lib':
      return {
        plugins: [react()],
        base: '/email-builder-js/',
        build: {
          outDir: 'distLib',
          lib: {
            entry: 'src/emailbuilder.component.jsx',
            name: 'EmailBuilderJsComponent',
            fileName: (format) => `email-builder-js-component.${format}.js`,
            formats: ['iife']
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
    case 'site':
    default:
      return {
        plugins: [
          react(),
          copy({
            targets: [
              { src: 'distLib/email-builder-js-component.iife.js', dest: 'dist' },
            ],
            hook: 'writeBundle',
            verbose: true, 
          }),
        ],
        base: '/email-builder-js/'
      }
  }
});