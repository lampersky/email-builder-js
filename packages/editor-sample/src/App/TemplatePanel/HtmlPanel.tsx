import React, { useMemo } from 'react';

import { renderToStaticMarkup } from '@usewaypoint/email-builder';

import { useDocument, useEditorStore } from '../../documents/editor/EditorContext';

import HighlightedCodePanel from './helper/HighlightedCodePanel';

export default function HtmlPanel() {
  const store = useEditorStore();
  const document = useDocument(store);
  const code = useMemo(() => renderToStaticMarkup(document, { rootBlockId: 'root' }), [document]);
  return <HighlightedCodePanel type="html" value={code} />;
}
