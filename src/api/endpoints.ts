export const ENDPOINTS = {
  // Auth
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGIN: '/auth/login',

  // Categories & Algorithms (Public)
  CATEGORIES: '/categories',
  ALGORITHMS: '/algorithms',
  ALGORITHM_BY_SLUG: (slug: string) => `/algorithms/${slug}`,
  VISUALIZE_ALGORITHM: (slug: string) => `/algorithms/${slug}/visualize`,

  // Problems (Practice Platform)
  PROBLEMS: '/problems',
  PROBLEM_BY_SLUG: (slug: string) => `/problems/${slug}`,
  PROBLEM_RUN: (slug: string) => `/problems/${slug}/run`,
  PROBLEM_SUBMIT: (slug: string) => `/problems/${slug}/submit`,
  PROBLEM_SUBMISSIONS: (slug: string) => `/problems/${slug}/submissions`,

  // User Profile, Favorites, Progress & Submissions
  USER_PROFILE: '/users/me',
  USER_PROFILE_DETAILS: '/users/me/profile',
  USER_PROFILE_ACTIVITY: '/users/me/profile/activity',
  USER_ACHIEVEMENTS: '/users/me/achievements',
  USER_BADGES: '/users/me/badges',
  USER_GAMIFICATION_SUMMARY: '/users/me/gamification',
  USER_STREAK_STATUS: '/users/me/streak',
  FAVORITES: '/users/me/favorites',
  FAVORITE_BY_SLUG: (slug: string) => `/users/me/favorites/${slug}`,
  PROGRESS: '/users/me/progress',
  PROGRESS_START: (slug: string) => `/users/me/progress/${slug}/start`,
  PROGRESS_UPDATE: (slug: string) => `/users/me/progress/${slug}`,
  PROGRESS_COMPLETE: (slug: string) => `/users/me/progress/${slug}/complete`,
  PROGRESS_BY_SLUG: (slug: string) => `/users/me/progress/${slug}`,
  DASHBOARD: '/users/me/dashboard',
  USER_SUBMISSIONS: '/users/me/submissions',
  USER_PROBLEM_STATS: '/users/me/problem-stats',

  // Roadmap & Guidance
  ROADMAP: '/roadmap',
  ROADMAP_MODULE_DETAILS: (slug: string) => `/roadmap/modules/${slug}`,
  ROADMAP_ASSESSMENT: '/roadmap/assessment',
  ROADMAP_RECOMMENDATIONS: '/roadmap/recommendations',

  // Phase 17 Learning Domain
  LEARNING_PATHS: '/learning/paths',
  LEARNING_PATH_BY_SLUG: (slug: string) => `/learning/paths/${slug}`,
  LEARNING_MODULE_DETAILS: (slug: string) => `/learning/modules/${slug}`,
  LEARNING_ASSESSMENT: '/learning/assessment',
  USER_ROADMAP: '/users/me/roadmap',
  USER_MODULE_START: (slug: string) => `/users/me/roadmap/modules/${slug}/start`,
  USER_RECOMMENDATIONS: '/users/me/recommendations',
  USER_LEARNING_PREFERENCES: '/users/me/learning-preferences',


  // Admin
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_CATEGORY_BY_SLUG: (slug: string) => `/admin/categories/${slug}`,
  ADMIN_ALGORITHMS: '/admin/algorithms',
  ADMIN_ALGORITHM_BY_SLUG: (slug: string) => `/admin/algorithms/${slug}`,
};
