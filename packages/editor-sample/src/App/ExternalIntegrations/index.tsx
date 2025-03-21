import React, { useEffect, useRef, useState } from 'react';

import { useDocument, resetDocument, toggleInspectorDrawerOpen, toggleSamplesDrawerOpen } from '../../documents/editor/EditorContext';
import { renderToStaticMarkup } from '@usewaypoint/email-builder';
import validateJsonStringValue from '../TemplatePanel/ImportJson/validateJsonStringValue';

export default function ExternalIntegrations() {
  const document = useDocument();

  const [shouldRunEffect, setShouldRunEffect] = useState(true);

  const documentRef = useRef(document);

  useEffect(() => {
    documentRef.current = document;
  }, [document]);

  useEffect(() => {
    if (!shouldRunEffect) return;

    const json = JSON.stringify(document);
    var uri = `data:text/plain,${encodeURIComponent(json)}`;
    const html = renderToStaticMarkup(document, { rootBlockId: 'root' });

    if (window.parent) {
      window.parent.postMessage({ action: 'watch', reactiveVariables: {
        uri: uri,
        html: html,
        json: json
      }}, "*");
    }
  }, [document, shouldRunEffect]);

  useEffect(() => {
    const handleMessage = (event) => {
      
      //if (event.source !== self) return;
      if (false) {
        console.log("Received message:", event.data);
        console.log("Source:", event.source);
        console.log("self:", self);
        console.log("RAW:", event);
      }

      const recipient = event.source ?? window.parent;
      const origin = (event.origin === 'null' || !event.origin) ? "*" : event.origin;

      if (event.data?.payload?.method === 'resetDocument') {
        const { error, data } = validateJsonStringValue(event.data?.payload?.args?.at(0));
        if (!data) {
          recipient.postMessage({ id: event.data.id, response: { success: false, error: error, result: null } }, origin);
          return;
        }
        resetDocument(data);
        recipient.postMessage({ id: event.data.id, response: { success: true, error: null, result: null } }, origin);
      }
      else if (event.data?.payload?.method === 'getHtml') {
        const html = renderToStaticMarkup(documentRef.current, { rootBlockId: 'root' });
        recipient.postMessage({ id: event.data.id, response: html }, origin);
      }
      else if (event.data?.payload?.method === 'getJson') {
        const json = JSON.stringify(documentRef.current);
        recipient.postMessage({ id: event.data.id, response: json }, origin);
      }
      else if (event.data?.payload?.method === 'toggleInspectorDrawerOpen') {
        toggleInspectorDrawerOpen();
        recipient.postMessage({ id: event.data.id, response: { success: true, error: null, result: null } }, origin);
      }
      else if (event.data?.payload?.method === 'toggleSamplesDrawerOpen') {
        toggleSamplesDrawerOpen();
        recipient.postMessage({ id: event.data.id, response: { success: true, error: null, result: null } }, origin);
      }

    };
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (<></>);
}
