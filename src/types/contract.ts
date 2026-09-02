export type RendererKey =
  | 'array'
  | 'pointer-array'
  | 'linked-list'
  | 'stack'
  | 'queue'
  | 'tree'
  | 'heap'
  | 'graph'
  | 'hash-table'
  | 'trie'
  | 'recursion-tree'
  | 'dp-table'
  | 'string'
  | 'geometry';

export type InputMode = 'CUSTOMIZABLE' | 'FIXED_DEMO';

export type ContractStatus =
  | 'READY'
  | 'MISSING_GENERATOR'
  | 'MISSING_RENDERER'
  | 'MISSING_CONTRACT'
  | 'INVALID_DATA'
  | 'INCOMPLETE_STEPS';

export interface VisualizationContract {
  algorithmSlug: string;
  visualizationType: string;
  dataStructureType: string;
  inputMode: InputMode;
  inputSchema?: string;
  sampleInput?: string;
  generatorKey: string;
  rendererKey: RendererKey;
  stepSchema?: string;
  visualizationConfig?: string;
  learningVisualizationDescription?: string;
  supportsCustomInput: boolean;
  maxInputSize: number;
  status: ContractStatus;
}

export interface VisualizationAuditItem {
  algorithmName: string;
  algorithmSlug: string;
  categoryName: string;
  categorySlug: string;
  visualizationType: string;
  dataStructureType: string;
  inputMode: InputMode;
  generatorKey: string;
  rendererKey: string;
  supportsCustomInput: boolean;
  status: ContractStatus;
}

export interface VisualizationAuditDto {
  totalAlgorithms: number;
  readyCount: number;
  missingGeneratorCount: number;
  missingRendererCount: number;
  missingContractCount: number;
  invalidDataCount: number;
  customizableCount: number;
  fixedDemoCount: number;
  items: VisualizationAuditItem[];
}
