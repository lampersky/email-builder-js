import React from 'react';

import { FirstPageOutlined, MenuOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import { toggleSamplesDrawerOpen, useEditorStore, useSamplesDrawerOpen } from '../../documents/editor/EditorContext';

function useIcon(store: ReturnType<typeof useEditorStore>) {
  const samplesDrawerOpen = useSamplesDrawerOpen(store);
  if (samplesDrawerOpen) {
    return <FirstPageOutlined fontSize="small" />;
  }
  return <MenuOutlined fontSize="small" />;
}

export default function ToggleSamplesPanelButton() {
  const store = useEditorStore();
  const icon = useIcon(store);
  const toggle = () => toggleSamplesDrawerOpen(store);
  return <IconButton onClick={toggle}>{icon}</IconButton>;
}
