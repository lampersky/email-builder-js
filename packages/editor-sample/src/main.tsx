import React from 'react';
import ReactDOM from 'react-dom/client';

import { CssBaseline, ThemeProvider } from '@mui/material';

import App from './App';
import theme from './theme';
import { EditorStateProvider } from './documents/editor/EditorContext';
import getConfiguration from './getConfiguration';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <EditorStateProvider initialConfig={getConfiguration(window.location.hash)}>
        <App />
      </EditorStateProvider>
    </ThemeProvider>
  </React.StrictMode>
);
