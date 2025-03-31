import React from 'react';

import { AppRegistrationOutlined, LastPageOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import { toggleInspectorDrawerOpen, useEditorStore, useInspectorDrawerOpen } from '../../documents/editor/EditorContext';

export default function ToggleInspectorPanelButton() {
  const store = useEditorStore();
  const inspectorDrawerOpen = useInspectorDrawerOpen(store);

  const handleClick = () => {
    toggleInspectorDrawerOpen(store);
  };
  if (inspectorDrawerOpen) {
    return (
      <IconButton onClick={handleClick}>
        <LastPageOutlined fontSize="small" />
      </IconButton>
    );
  }
  return (
    <IconButton onClick={handleClick}>
      <AppRegistrationOutlined fontSize="small" />
    </IconButton>
  );
}
