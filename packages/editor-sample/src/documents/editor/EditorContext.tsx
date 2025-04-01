import React, { createContext, useContext } from 'react';
import { create } from 'zustand';
import getConfiguration from '../../getConfiguration';
import { TEditorConfiguration } from './core';

type TValue = {
  document: TEditorConfiguration;
  selectedBlockId: string | null;
  selectedSidebarTab: 'block-configuration' | 'styles';
  selectedMainTab: 'editor' | 'preview' | 'json' | 'html';
  selectedScreenSize: 'desktop' | 'mobile';
  inspectorDrawerOpen: boolean;
  samplesDrawerOpen: boolean;
};

const createEditorStateStore = (initialConfig: TEditorConfiguration) =>
  create<TValue>(() => ({
    document: initialConfig,
    selectedBlockId: null,
    selectedSidebarTab: 'styles',
    selectedMainTab: 'editor',
    selectedScreenSize: 'desktop',
    inspectorDrawerOpen: true,
    samplesDrawerOpen: true,
  }));

const EditorStoreContext = createContext<ReturnType<typeof createEditorStateStore> | null>(null);

export const EditorStateProvider: React.FC<{ initialConfig?: TEditorConfiguration; children: React.ReactNode }> = ({
  initialConfig,
  children,
}) => {
  const store = createEditorStateStore(initialConfig || getConfiguration(''));
  return <EditorStoreContext.Provider value={store}>{children}</EditorStoreContext.Provider>;
};

export const useEditorStore = () => {
  const store = useContext(EditorStoreContext);
  if (!store) {
    throw new Error('store must be used within an <EditorStateProvider>');
  }
  return store;
};

export function useDocument(store: ReturnType<typeof createEditorStateStore>) {
  return store((s) => s.document);
}

export function useSelectedBlockId(store: ReturnType<typeof createEditorStateStore>) {
  return store((s) => s.selectedBlockId);
}

export function useSelectedScreenSize(store: ReturnType<typeof createEditorStateStore>) {
  return store((s) => s.selectedScreenSize);
}

export function useSelectedMainTab(store: ReturnType<typeof createEditorStateStore>) {
  return store((s) => s.selectedMainTab);
}

export function setSelectedMainTab(store: ReturnType<typeof createEditorStateStore>, selectedMainTab: TValue['selectedMainTab']) {
  return store.setState({ selectedMainTab });
}

export function useSelectedSidebarTab(store: ReturnType<typeof createEditorStateStore>) {
  return store((s) => s.selectedSidebarTab);
}

export function useInspectorDrawerOpen(store: ReturnType<typeof createEditorStateStore>) {
  return store((s) => s.inspectorDrawerOpen);
}

export function useSamplesDrawerOpen(store: ReturnType<typeof createEditorStateStore>) {
  return store((s) => s.samplesDrawerOpen);
}

export function setSelectedBlockId(store: ReturnType<typeof createEditorStateStore>, selectedBlockId: TValue['selectedBlockId']) {
  const selectedSidebarTab = selectedBlockId === null ? 'styles' : 'block-configuration';
  const options: Partial<TValue> = {};
  if (selectedBlockId !== null) {
    options.inspectorDrawerOpen = true;
  }
  return store.setState({
    selectedBlockId,
    selectedSidebarTab,
    ...options,
  });
}

export function setSidebarTab(store: ReturnType<typeof createEditorStateStore>, selectedSidebarTab: TValue['selectedSidebarTab']) {
  return store.setState({ selectedSidebarTab });
}

export function resetDocument(store: ReturnType<typeof createEditorStateStore>, document: TValue['document']) {
  return store.setState({
    document,
    selectedSidebarTab: 'styles',
    selectedBlockId: null,
  });
}

export function setDocument(store: ReturnType<typeof createEditorStateStore>, document: TValue['document']) {
  const originalDocument = store.getState().document;
  return store.setState({
    document: {
      ...originalDocument,
      ...document,
    },
  });
}

export function toggleInspectorDrawerOpen(store: ReturnType<typeof createEditorStateStore>) {
  const inspectorDrawerOpen = !store.getState().inspectorDrawerOpen;
  return store.setState({ inspectorDrawerOpen });
}

export function toggleSamplesDrawerOpen(store: ReturnType<typeof createEditorStateStore>) {
  const samplesDrawerOpen = !store.getState().samplesDrawerOpen;
  return store.setState({ samplesDrawerOpen });
}

export function setSelectedScreenSize(store: ReturnType<typeof createEditorStateStore>, selectedScreenSize: TValue['selectedScreenSize']) {
  return store.setState({ selectedScreenSize });
}