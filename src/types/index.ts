// Enums & String Literal Types
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXTREME_HARD';

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

// Analytics, Streaks, XP & Gamification Models
export interface UserStreakDto {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate?: string;
  streakFreezeCount: number;
}

export interface UserXpDto {
  totalXp: number;
  currentLevel: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  levelProgressPercentage: number;
}

export interface BadgeDto {
  code: string;
  name: string;
  description: string;
  iconName: string;
  category: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface DailyActivityDto {
  date: string;
  count: number;
  xpEarned: number;
}

export interface TopicSkillDto {
  categoryName: string;
  categorySlug: string;
  score: number;
}

export interface LeaderboardUserDto {
  rank: number;
  username: string;
  currentLevel: number;
  totalXp: number;
  problemsSolved: number;
}

export interface AnalyticsOverviewResponse {
  userStreak: UserStreakDto;
  userXp: UserXpDto;
  totalBadgesUnlocked: number;
  totalBadgesAvailable: number;
  recentBadges: BadgeDto[];
  topicSkills: TopicSkillDto[];
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
  codeLineMap?: Record<string, number>;
  beginnerExplanation?: string;
  advancedExplanation?: string;
  whyMessage?: string;
  complexityImpact?: string;
}

export interface VisualizationResponse {
  algorithm: string;
  visualizationType: VisualizationType;
  steps: VisualizationStep[];
}

export interface AlgorithmMasteryDto {
  algorithmSlug: string;
  mastered: boolean;
  masteredAt?: string;
  xpEarned: number;
  newlyMastered: boolean;
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

// Practice Arena & Session Models (Phase 15)
export type PracticeMode = 'DAILY' | 'QUICK' | 'TOPIC' | 'RANDOM' | 'TIMED' | 'STREAK';
export type SessionStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED' | 'EXPIRED';
export type SessionProblemStatus = 'UNATTEMPTED' | 'ATTEMPTED' | 'SOLVED';

export interface DailyChallengeDto {
  id: string;
  challengeDate: string;
  problem: ProblemSummary;
  bonusXp: number;
  completed: boolean;
  status: string;
}

export interface PracticeSessionProblemDto {
  id: string;
  orderIndex: number;
  problem: ProblemSummary;
  status: SessionProblemStatus;
  submissionId?: string;
  solvedAt?: string;
}

export interface PracticeSessionDto {
  id: string;
  mode: PracticeMode;
  status: SessionStatus;
  difficulty?: Difficulty;
  categoryName?: string;
  timeLimitSeconds?: number;
  totalProblems: number;
  solvedProblems: number;
  score: number;
  xpEarned: number;
  accuracyPercentage: number;
  startedAt: string;
  completedAt?: string;
  problems: PracticeSessionProblemDto[];
}

export interface PracticeArenaOverviewResponse {
  dailyChallenge: DailyChallengeDto;
  streak: UserStreakDto;
  xp: UserXpDto;
  activeSession?: PracticeSessionDto;
  totalCompletedSessions: number;
  recentSessions: PracticeSessionDto[];
}

export interface CreatePracticeSessionRequest {
  mode: PracticeMode;
  difficulty?: Difficulty;
  categoryId?: string;
  timeLimitSeconds?: number;
}

export interface SessionSubmitRequest {
  problemId: string;
  language: string;
  code: string;
}

export interface SessionSubmitResponse {
  submission: SubmissionResponse;
  session: PracticeSessionDto;
  sessionCompleted: boolean;
  xpEarnedInAttempt: number;
}

// User Profile & Gamification UI Models (Phase 16)
export interface UserProfileUpdateRequest {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  country?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export interface LevelProgressDto {
  currentLevel: number;
  title: string;
  currentXp: number;
  xpInCurrentLevel: number;
  xpRequiredForNextLevel: number;
  levelXpSpan: number;
  progressPercentage: number;
}

export interface StreakStatusDto {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate?: string;
  activeToday: boolean;
  streakFreezeCount: number;
  nextMilestoneDays: number;
  daysToNextMilestone: number;
}

export interface AchievementItemDto {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  rarity: string;
  xpReward: number;
  requirementType: string;
  requirementValue: number;
  unlocked: boolean;
  unlockedAt?: string;
  currentValue: number;
  progressPercentage: number;
}

export interface BadgeItemDto {
  id: string;
  code: string;
  name: string;
  description: string;
  iconName: string;
  category: string;
  rarity: string;
  xpReward: number;
  earned: boolean;
  earnedAt?: string;
}

export interface UserActivityDto {
  id: string;
  activityType: string;
  referenceType?: string;
  referenceId?: string;
  xpEarned: number;
  metadata?: string;
  createdAt: string;
}

export interface UserProfileDto {
  id: string;
  userId: string;
  username: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  country?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  totalXp: number;
  currentLevel: number;
  currentStreak: number;
  longestStreak: number;
  totalProblemsSolved: number;
  totalAlgorithmsCompleted: number;
  totalPracticeSessions: number;
  createdAt: string;
  updatedAt: string;
  levelProgress?: LevelProgressDto;
  streakStatus?: StreakStatusDto;
}

export interface GamificationSummaryDto {
  level: number;
  totalXp: number;
  levelProgress: LevelProgressDto;
  currentStreak: number;
  longestStreak: number;
  totalProblemsSolved: number;
  totalAlgorithmsCompleted: number;
  totalPracticeSessions: number;
  achievementsUnlocked: number;
  totalAchievements: number;
  badgesEarned: number;
  totalBadges: number;
  recentActivity: UserActivityDto[];
}

export type RoadmapTier = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type RoadmapStepType = 'LEARN' | 'VISUALIZE' | 'PRACTICE' | 'CHALLENGE' | 'MASTER';
export type RoadmapStatus = 'LOCKED' | 'IN_PROGRESS' | 'COMPLETED';

export interface RoadmapStepDto {
  id: string;
  stepNumber: number;
  stepType: RoadmapStepType;
  title: string;
  description: string;
  referenceSlug?: string;
  xpReward: number;
  completed: boolean;
}

export interface RoadmapModuleDto {
  id: string;
  slug: string;
  title: string;
  description: string;
  orderIndex: number;
  tier: RoadmapTier;
  iconName: string;
  categorySlug?: string;
  prerequisiteModuleSlug?: string;
  prerequisiteModuleTitle?: string;
  xpReward: number;
  status: RoadmapStatus;
  completionPercentage: number;
  steps?: RoadmapStepDto[];
}

export interface AssessmentRequestDto {
  experienceLevel: RoadmapTier;
  preferredLanguage?: string;
  knowsArrays?: boolean;
  knowsSorting?: boolean;
  knowsTrees?: boolean;
  solvedProblemsBefore?: boolean;
  goal?: string;
}

export interface AssessmentResultDto {
  assessmentId: string;
  assignedTier: RoadmapTier;
  recommendedModuleSlug: String;
  recommendedModuleTitle: String;
  summaryMessage: string;
  bonusXpEarned: number;
}

export interface NextRecommendationDto {
  moduleSlug: string;
  moduleTitle: string;
  stepTitle: string;
  stepType: string;
  referenceSlug?: string;
  actionUrl: string;
  recommendationReason: string;
  xpReward: number;
}

export type ExperienceLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type PrimaryGoal = 'LEARN_DSA' | 'INTERVIEW_PREPARATION' | 'COMPETITIVE_PROGRAMMING' | 'IMPROVE_PROBLEM_SOLVING' | 'COLLEGE_STUDY';

export interface LearningPathDto {
  id: string;
  slug: string;
  name: string;
  description: string;
  difficulty: ExperienceLevel;
  estimatedDuration: string;
  displayOrder: number;
  isActive: boolean;
  modules?: RoadmapModuleDto[];
}

export interface UserLearningPreferenceDto {
  experienceLevel: ExperienceLevel;
  preferredLanguage: string;
  dailyLearningMinutes: number;
  primaryGoal: PrimaryGoal;
  completedAssessment: boolean;
}

export interface LearningRecommendationDto {
  type: string;
  title: string;
  description: string;
  slug: string;
  progress: number;
  xpReward: number;
  actionLabel: string;
  actionUrl: string;
}

export interface UserRoadmapDto {
  path: {
    slug?: string;
    name?: string;
  };
  overallProgress: number;
  currentModule: RoadmapModuleDto | null;
  modules: RoadmapModuleDto[];
}


