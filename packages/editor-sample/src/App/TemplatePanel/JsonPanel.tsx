import React, { useMemo } from 'react';

import { useDocument, useEditorStore } from '../../documents/editor/EditorContext';

import HighlightedCodePanel from './helper/HighlightedCodePanel';

export default function JsonPanel() {
  const store = useEditorStore();
  const document = useDocument(store);
  const code = useMemo(() => JSON.stringify(document, null, '  '), [document]);
  return <HighlightedCodePanel type="json" value={code} />;
}
