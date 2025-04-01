import React from 'react';

import { setDocument, useDocument, useEditorStore } from '../../documents/editor/EditorContext';

import EmailLayoutSidebarPanel from './ConfigurationPanel/input-panels/EmailLayoutSidebarPanel';

export default function StylesPanel() {
  const store = useEditorStore();
  const block = useDocument(store).root;
  if (!block) {
    return <p>Block not found</p>;
  }

  const { data, type } = block;
  if (type !== 'EmailLayout') {
    throw new Error('Expected "root" element to be of type EmailLayout');
  }

  return <EmailLayoutSidebarPanel key="root" data={data} setData={(data) => setDocument(store, { root: { type, data } })} />;
}
