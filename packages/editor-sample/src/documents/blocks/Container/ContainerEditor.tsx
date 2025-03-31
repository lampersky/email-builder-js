import React from 'react';

import { Container as BaseContainer } from '@usewaypoint/block-container';

import { useCurrentBlockId } from '../../editor/EditorBlock';
import { setDocument, setSelectedBlockId, useDocument, useEditorStore } from '../../editor/EditorContext';
import EditorChildrenIds from '../helpers/EditorChildrenIds';

import { ContainerProps } from './ContainerPropsSchema';

export default function ContainerEditor({ style, props }: ContainerProps) {
  const childrenIds = props?.childrenIds ?? [];

  const store = useEditorStore();
  const document = useDocument(store);
  const currentBlockId = useCurrentBlockId();

  return (
    <BaseContainer style={style}>
      <EditorChildrenIds
        childrenIds={childrenIds}
        onChange={({ block, blockId, childrenIds }) => {
          setDocument(store, {
            [blockId]: block,
            [currentBlockId]: {
              type: 'Container',
              data: {
                ...document[currentBlockId].data,
                props: { childrenIds: childrenIds },
              },
            },
          });
          setSelectedBlockId(store, blockId);
        }}
      />
    </BaseContainer>
  );
}
