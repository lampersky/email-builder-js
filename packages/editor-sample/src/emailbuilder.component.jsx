import React from "react";
import ReactDOM from "react-dom/client";
import App from './App';
import theme from './theme';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

class MyWebComponent extends HTMLElement {
  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "open" });

    const mountPoint = document.createElement("div");
    shadowRoot.appendChild(mountPoint);

    const emotionRoot = document.createElement("style");
    shadowRoot.appendChild(emotionRoot);

    const shadowCache = createCache({
      key: 'css',
      prepend: true,
      container: shadowRoot,
    });

    const th = createTheme(theme, {
      components: {
        MuiPopover: {
          defaultProps: {
            container: mountPoint,
          },
        },
        MuiPopper: {
          defaultProps: {
            container: mountPoint,
          },
        },
        MuiModal: {
          defaultProps: {
            container: mountPoint,
          },
        },
      },
    });

    const root = ReactDOM.createRoot(mountPoint);
    root.render(
      <React.StrictMode>
        <CacheProvider value={shadowCache}>
          <ThemeProvider theme={th}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </CacheProvider>
      </React.StrictMode>
    );
  }
}

customElements.define("my-web-component", MyWebComponent);