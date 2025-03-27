import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react-swc';

// export default defineConfig({
//   plugins: [react()],
//   base: '/email-builder-js/',
// });


export default defineConfig({
    plugins: [react()],
    build: {
      lib: {
        entry: 'src/emailbuilder.component.jsx',
        name: 'MyWebComponent',
        fileName: (format) => `my-web-component.${format}.js`,
        formats: ['iife'],
      },
      rollupOptions: {
        external: [
          '@emotion/react', '@emotion/styled', '@mui/material', 
          'react', 'react-dom'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            '@mui/material': 'MaterialUI',
            '@emotion/react': 'emotionReact',
            '@emotion/styled': 'emotionStyled',
          },
        },
      },
    },
    define: {
      'process.env': process.env
    }
  }
);