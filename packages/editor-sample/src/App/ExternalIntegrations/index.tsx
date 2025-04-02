import React, { useEffect, useRef, useState } from 'react';

import { useDocument, resetDocument, toggleInspectorDrawerOpen, toggleSamplesDrawerOpen, useEditorStore } from '../../documents/editor/EditorContext';
import { renderToStaticMarkup } from '@usewaypoint/email-builder';
import validateJsonStringValue from '../TemplatePanel/ImportJson/validateJsonStringValue';

type Props = {
  element: HTMLElement;
  onLoaded?: () => void;
};

export default function ExternalIntegrations({ element, onLoaded } : Props) {
  const store = useEditorStore();
  const document = useDocument(store);

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
    }, element);
  }, [document, shouldRunEffect]);

  useEffect(() => {
    window.integrator.register(element,
      { 
        test: (args: Array<any>, success: Function, error: Function) => {
          try {
            const randomValue = Math.random();
            const isSuccess = randomValue > 0.5;
            if (!isSuccess) throw 'Something went wrong';
            success(randomValue);
          } catch (e) {
            error(e); 
          }
        },
        setWatcherEnabled: (args: Array<any>, success: Function, error: Function) => {
          try {
            setShouldRunEffect(args[0]);
            success();
          } catch (e) {
            error(e); 
          }
        },
        getHtml: (args: Array<any>, success: Function, error: Function) => {
          try {
            success(renderToStaticMarkup(documentRef.current, { rootBlockId: 'root' }));
          } catch {
            error('Something went wrong!'); 
          }
        },
        getJson: (args: Array<any>, success: Function, error: Function) => {
          try {
            success(JSON.stringify(documentRef.current));
          } catch (e) {
            error('Something went wrong!'); 
          }
        },
        toggleInspector: (args: Array<any>, success: Function, error: Function) => {
          toggleInspectorDrawerOpen(store);
          success();
        },
        toggleSamples: (args: Array<any>, success: Function, error: Function) => {
          toggleSamplesDrawerOpen(store);
          success();
        },
        loadTemplate: (args: Array<any>, success: Function, error: Function) => {
          try {
            const { error, data } = validateJsonStringValue(args[0]);
            if (!data) throw error;
            resetDocument(store, data);
            success();
          } catch (e) {
            error(e); 
          }
        }
    });

    const uninstall = window.integrator.install(element);
    if (onLoaded) {
      onLoaded();
    }
    return uninstall;
  }, []);

  return (<></>);
}