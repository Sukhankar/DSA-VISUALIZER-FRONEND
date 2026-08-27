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

  // Admin
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_CATEGORY_BY_SLUG: (slug: string) => `/admin/categories/${slug}`,
  ADMIN_ALGORITHMS: '/admin/algorithms',
  ADMIN_ALGORITHM_BY_SLUG: (slug: string) => `/admin/algorithms/${slug}`,
};
