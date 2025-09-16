// Query configuration constants
export const QUERY_STALE_TIME = 2 * 60 * 1000; // 2 minutes
export const QUERY_GC_TIME = 5 * 60 * 1000; // 5 minutes

// Default pagination values
export const DEFAULT_ACTIVITIES_LIMIT = 8;
export const DEFAULT_ACTIVITIES_OFFSET = 0;

// Query keys for React Query
export const QUERY_KEYS = {
  recentActivities: (params?: { limit?: number; offset?: number }) =>
    ["recent-activities", params] as const,
} as const;
