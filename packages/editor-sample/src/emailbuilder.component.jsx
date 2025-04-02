import React from "react";
import ReactDOM from "react-dom/client";
import App from './App';
import theme from './theme';
import { createTheme, CssBaseline, ThemeProvider, Box } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import ExternalIntegrations from "./App/ExternalIntegrations";
import { EditorStateProvider } from "./documents/editor/EditorContext";
import getConfiguration from "./getConfiguration";

class EmailBuilderJsComponent extends HTMLElement {
  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "open" });

    const onLoadedAttr = this.getAttribute('onLoaded');

    this.shadowRoot.innerHTML = `
      <style>
        *,*::before,*::after{box-sizing:inherit;}
        #root {
          box-sizing: border-box;
        }
      </style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css" />
    `;

    const mountPoint = document.createElement("div");
    mountPoint.id = 'root';
    shadowRoot.appendChild(mountPoint);

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
        MuiDrawer: {
          styleOverrides: {
            paper: {
              position: 'absolute'
            },
          }
        },
      },
    });

    const loaded = () => {
      if (onLoadedAttr) {
        const fn = new Function(onLoadedAttr);
        fn();
      }
    };

    this.root = ReactDOM.createRoot(mountPoint);
    this.root.render(
      <React.StrictMode>
        <CacheProvider value={shadowCache}>
          <ThemeProvider theme={th}>
            <CssBaseline />
            <Box sx={{ position: 'relative' }}>
              <EditorStateProvider initialConfig={getConfiguration('')}>
                <ExternalIntegrations element={this} onLoaded={loaded}></ExternalIntegrations>
                <App />
              </EditorStateProvider>
            </Box>
          </ThemeProvider>
        </CacheProvider>
      </React.StrictMode>
    );
  }

  disconnectedCallback() {
    this.root.unmount();
  }
}

customElements.define("email-builder-js", EmailBuilderJsComponent);