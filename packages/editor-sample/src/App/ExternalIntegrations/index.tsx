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

    window.integrator.update({
      uri,
      html,
      json,
    });
  }, [document, shouldRunEffect]);

  window.integrator.register('test',(args: [], success: Function, error: Function) => {
    try {
      const randomValue = Math.random();
      const isSuccess = randomValue > 0.5;
      if (!isSuccess) throw 'Something went wrong';
      success(randomValue);
    } catch (e) {
      error(e); 
    }
  });

  window.integrator.register('getHtml',(args: [], success: Function, error: Function) => {
    try {
      success(renderToStaticMarkup(documentRef.current, { rootBlockId: 'root' }));
    } catch {
      error('Something went wrong!'); 
    }
  });

  window.integrator.register('getJson',(args: [], success: Function, error: Function) => {
    try {
      success(JSON.stringify(documentRef.current));
    } catch (e) {
      error('Something went wrong!'); 
    }
  });

  window.integrator.register('toggleInspector',(args: [], success: Function, error: Function) => {
      toggleInspectorDrawerOpen();
      success();
  });

  window.integrator.register('toggleSamples',(args: [], success: Function, error: Function) => {
    toggleSamplesDrawerOpen();
    success();
  });

  window.integrator.register('loadTemplate',(args: Array<any>, success: Function, error: Function) => {
    try {
      const { error, data } = validateJsonStringValue(args[0]);
      if (!data) throw error;
      resetDocument(data);
      success();
    } catch (e) {
      error(e); 
    }
  });

  useEffect(() => {
    const uninstall = window.integrator.install();
    return uninstall;
  }, []);

  return (<></>);
}
