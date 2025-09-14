import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authFetch } from '@/modules/auth/utils';
import type { RecentActivitiesResponse, RecentActivitiesParams } from '@/modules/dashboard/types/activity';

const QUERY_KEYS = {
  recentActivities: (params?: RecentActivitiesParams) => [
    'recent-activities',
    params,
  ] as const,
} as const;

async function fetchRecentActivities(
  params: RecentActivitiesParams = {}
): Promise<RecentActivitiesResponse> {
  const { limit = 8, offset = 0 } = params;

  const searchParams = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });

  const response = await authFetch(`/api/recent-activities?${searchParams}`);

  if (!response.ok) {
    const error = new Error('Failed to fetch recent activities') as Error & { status: number };
    error.status = response.status;
    throw error;
  }

  return response.json();
}

export function useRecentActivities(params: RecentActivitiesParams = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.recentActivities(params),
    queryFn: () => fetchRecentActivities(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useRefreshActivities() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: RecentActivitiesParams = {}) => {
      return fetchRecentActivities(params);
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        QUERY_KEYS.recentActivities(variables),
        data
      );
    },
    onError: (error) => {
      console.error('Failed to refresh activities:', error);
    },
  });
}

export function useInvalidateActivities() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({
      queryKey: ['recent-activities'],
    });
  };
}