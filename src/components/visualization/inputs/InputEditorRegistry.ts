import React from 'react';
import { DataStructureType, VisualizationInputState } from '../../../types/inputState';
import { ConvexHullInputEditor } from './ConvexHullInputEditor';
import { ArrayInputEditor } from './ArrayInputEditor';
import { SearchingInputEditor } from './SearchingInputEditor';
import { LinkedListInputEditor } from './LinkedListInputEditor';
import { StackInputEditor } from './StackInputEditor';
import { QueueInputEditor } from './QueueInputEditor';
import { TreeInputEditor } from './TreeInputEditor';
import { AVLTreeInputEditor } from './AVLTreeInputEditor';
import { HeapInputEditor } from './HeapInputEditor';
import { GraphInputEditor } from './GraphInputEditor';
import { HashTableInputEditor } from './HashTableInputEditor';
import { TrieInputEditor } from './TrieInputEditor';
import { DPInputEditor } from './DPInputEditor';
import { RecursionInputEditor } from './RecursionInputEditor';
import { SlidingWindowInputEditor } from './SlidingWindowInputEditor';
import { TwoPointerInputEditor } from './TwoPointerInputEditor';

export interface InputEditorProps {
  inputState: VisualizationInputState;
  onChange: (state: VisualizationInputState) => void;
  onResetSample: () => void;
}

export function getInputEditorComponent(dataStructureType?: DataStructureType | string): React.FC<InputEditorProps> | null {
  if (!dataStructureType) return (ArrayInputEditor as unknown) as React.FC<InputEditorProps>;

  switch (dataStructureType) {
    case 'POINT_SET':
      return (ConvexHullInputEditor as unknown) as React.FC<InputEditorProps>;
    case 'SORTED_ARRAY':
    case 'POINTER_ARRAY':
      return (SearchingInputEditor as unknown) as React.FC<InputEditorProps>;
    case 'LINKED_LIST':
    case 'DOUBLY_LINKED_LIST':
      return (LinkedListInputEditor as unknown) as React.FC<InputEditorProps>;
    case 'STACK':
      return (StackInputEditor as unknown) as React.FC<InputEditorProps>;
    case 'QUEUE':
    case 'DEQUE':
      return (QueueInputEditor as unknown) as React.FC<InputEditorProps>;
    case 'BINARY_TREE':
      return (TreeInputEditor as unknown) as React.FC<InputEditorProps>;
    case 'AVL_TREE':
      return (AVLTreeInputEditor as unknown) as React.FC<InputEditorProps>;
    case 'HEAP':
      return (HeapInputEditor as unknown) as React.FC<InputEditorProps>;
    case 'GRAPH':
    case 'WEIGHTED_GRAPH':
    case 'GRAPH_NETWORK':
      return (GraphInputEditor as unknown) as React.FC<InputEditorProps>;
    case 'HASH_TABLE':
      return (HashTableInputEditor as unknown) as React.FC<InputEditorProps>;
    case 'TRIE':
      return (TrieInputEditor as unknown) as React.FC<InputEditorProps>;
    case 'DP_TABLE':
      return (DPInputEditor as unknown) as React.FC<InputEditorProps>;
    case 'RECURSION':
      return (RecursionInputEditor as unknown) as React.FC<InputEditorProps>;
    case 'ARRAY':
      return (ArrayInputEditor as unknown) as React.FC<InputEditorProps>;
    default:
      return (ArrayInputEditor as unknown) as React.FC<InputEditorProps>;
  }
}
