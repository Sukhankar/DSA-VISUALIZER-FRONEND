// Enums & String Literal Types
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type UserRole = 'ROLE_USER' | 'ROLE_ADMIN';
export type ProgressStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export type SubmissionStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
export type SubmissionVerdict =
  | 'ACCEPTED'
  | 'WRONG_ANSWER'
  | 'TIME_LIMIT_EXCEEDED'
  | 'RUNTIME_ERROR'
  | 'COMPILATION_ERROR'
  | 'INTERNAL_ERROR';

export type VisualizationType = 'ARRAY' | 'TREE' | 'GRAPH' | 'LINKED_LIST' | 'GRID';

export type ActionType =
  | 'INITIAL'
  | 'COMPARE'
  | 'SWAP'
  | 'NO_SWAP'
  | 'SELECT'
  | 'VISIT'
  | 'INSERT'
  | 'DELETE'
  | 'UPDATE'
  | 'FOUND'
  | 'NOT_FOUND'
  | 'COMPLETE';

// User & Authentication Models
export interface User {
  id: string;
  email: string;
  username: string;
  roles: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  username: string;
}

export interface CurrentUserResponse {
  id: string;
  email: string;
  username: string;
  roles: string[];
}

// Category & Algorithm Models
export interface AlgorithmCategory {
  id: string | number;
  name: string;
  slug: string;
  description?: string;
  displayOrder?: number;
}

export interface Algorithm {
  id: string | number;
  name: string;
  slug: string;
  description?: string;
  difficulty: Difficulty;
  timeComplexity?: string;
  spaceComplexity?: string;
  categoryName: string;
  categorySlug: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AlgorithmPageResponse {
  content: Algorithm[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface AlgorithmQueryParams {
  category?: string;
  difficulty?: Difficulty;
  search?: string;
  page?: number;
  size?: number;
  sort?: string;
}

// Rich Algorithm Content Models (LeetCode-Style)
export interface AlgorithmExample {
  exampleNumber: number;
  title: string;
  inputData: string;
  outputData: string;
  explanation?: string;
}

export interface AlgorithmImplementation {
  language: string;
  code: string;
  explanation?: string;
  displayOrder?: number;
}

export interface RelatedAlgorithmSummary {
  id: string;
  name: string;
  slug: string;
  difficulty: Difficulty;
  categoryName: string;
}

export interface AlgorithmDetailRichResponse {
  id: string;
  name: string;
  slug: string;
  description?: string;
  overview?: string;
  whenToUse?: string;
  advantages?: string;
  limitations?: string;
  constraints?: string;
  difficulty: Difficulty;
  timeComplexity?: string;
  spaceComplexity?: string;
  categoryName: string;
  categorySlug: string;
  examples: AlgorithmExample[];
  implementations: AlgorithmImplementation[];
  relatedAlgorithms: RelatedAlgorithmSummary[];
}

// Problem Practice Platform Models (LeetCode-Style)
export interface ProblemExampleDto {
  exampleNumber: number;
  inputData: string;
  outputData: string;
  explanation?: string;
}

export interface ProblemSummary {
  id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  categoryName: string;
  categorySlug: string;
  tags: string[];
}

export interface ProblemDetail {
  id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  description: string;
  constraints?: string;
  inputFormat?: string;
  outputFormat?: string;
  hints?: string;
  solutionExplanation?: string;
  categoryName: string;
  categorySlug: string;
  tags: string[];
  examples: ProblemExampleDto[];
  relatedAlgorithms: RelatedAlgorithmSummary[];
}

export interface ProblemPageResponse {
  content: ProblemSummary[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface ProblemQueryParams {
  difficulty?: Difficulty;
  category?: string;
  search?: string;
  page?: number;
  size?: number;
}

// Problem Submissions & Execution Models
export interface TestCaseEvaluationResult {
  testCaseNumber: number;
  inputData: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  isHidden: boolean;
  errorMessage?: string;
}

export interface RunCodeRequest {
  language: string;
  sourceCode: string;
}

export interface RunCodeResponse {
  passed: boolean;
  verdict: SubmissionVerdict;
  totalTests: number;
  passedTests: number;
  executionTimeMs: number;
  memoryUsedKb: number;
  testResults: TestCaseEvaluationResult[];
}

export interface SubmitCodeRequest {
  language: string;
  sourceCode: string;
}

export interface SubmissionResponse {
  id: string;
  problemSlug: string;
  problemTitle: string;
  language: string;
  sourceCode: string;
  status: SubmissionStatus;
  verdict: SubmissionVerdict;
  executionTimeMs?: number;
  memoryUsedKb?: number;
  totalTests: number;
  passedTests: number;
  submittedAt: string;
  completedAt?: string;
}

export interface ProblemUserStatsResponse {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalSubmissions: number;
  acceptedSubmissions: number;
  acceptanceRate: number;
}

// Visualization Request & Response Models
export interface GraphEdgeDto {
  from: string;
  to: string;
}

export interface GraphVisualizationRequest {
  nodes: string[];
  edges: GraphEdgeDto[];
  startNode: string;
}

export interface VisualizationRequest {
  input?: number[];
  target?: number;
  graph?: GraphVisualizationRequest;
}

export interface VisualizationStep {
  step: number;
  action: ActionType;
  indices?: number[];
  array?: number[];
  currentNode?: string;
  visitedNodes?: string[];
  frontier?: string[];
  message: string;
}

export interface VisualizationResponse {
  algorithm: string;
  visualizationType: VisualizationType;
  steps: VisualizationStep[];
}

// User Favorites & Progress Models
export interface FavoriteAlgorithmResponse {
  algorithmId: string;
  name: string;
  slug: string;
  difficulty: Difficulty;
  category: string;
  createdAt: string;
}

export interface ProgressResponse {
  algorithmId: string;
  algorithmName: string;
  algorithmSlug: string;
  status: ProgressStatus;
  progressPercentage: number;
  lastStep?: number;
  startedAt?: string;
  completedAt?: string;
  updatedAt: string;
}

export interface UpdateProgressRequest {
  progressPercentage: number;
  lastStep?: number;
}

export interface LearningDashboardResponse {
  totalAlgorithms: number;
  startedAlgorithms: number;
  completedAlgorithms: number;
  favoriteAlgorithms: number;
  completionPercentage: number;
  recentProgress: ProgressResponse[];
}

// API Error Response
export interface ApiErrorResponse {
  status?: number;
  message?: string;
  timestamp?: string;
  errors?: Record<string, string>;
}
