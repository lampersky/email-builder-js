import { defineConfig } from 'vite';
import path from 'path';

import react from '@vitejs/plugin-react-swc';

// export default defineConfig({
//   plugins: [react()],
//   base: '/email-builder-js/',
// });

export default defineConfig({
    plugins: [react()],
    base: '/email-builder-js/',
    build: {
      lib: {
        entry: 'src/emailbuilder.component.jsx',
        name: 'MyWebComponent',
        fileName: (format) => `my-web-component.${format}.js`,
        formats: ['iife'],
      },
      rollupOptions: {
        external: [
          'react', 'react-dom',
          //'@emotion/react', '@emotion/styled', '@mui/material',
          ],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            // '@mui/material': 'MaterialUI',
            // '@emotion/react': 'emotionReact',
            // '@emotion/styled': 'emotionStyled',
          },
        },
      },
    },
    define: {
      'process.env': process.env
    }
  }
);