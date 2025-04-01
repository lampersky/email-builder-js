import React from 'react';

import { Button } from '@mui/material';

import { resetDocument, useEditorStore } from '../../documents/editor/EditorContext';
import getConfiguration from '../../getConfiguration';

export default function SidebarButton({ href, children }: { href: string; children: JSX.Element | string }) {
  const store = useEditorStore();
  const handleClick = () => {
    resetDocument(store, getConfiguration(href));
  };
  return (
    <Button size="small" href={href} onClick={handleClick}>
      {children}
    </Button>
  );
}
