import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import * as Sentry from "@sentry/nextjs";
import toast from "react-hot-toast";

import { authFetch } from "@/modules/auth/utils/auth-fetch";
import type {
  RecentActivitiesResponse,
  RecentActivitiesParams,
} from "@/modules/dashboard/types/activity";
import {
  QUERY_KEYS,
  QUERY_STALE_TIME,
  QUERY_GC_TIME,
  DEFAULT_ACTIVITIES_LIMIT,
  DEFAULT_ACTIVITIES_OFFSET,
} from "../constants";

export const useRecentActivities = (
  params: RecentActivitiesParams = {},
  options?: UseQueryOptions<RecentActivitiesResponse, Error>
) => {
  return useQuery({
    queryKey: QUERY_KEYS.recentActivities(params),
    queryFn: async (): Promise<RecentActivitiesResponse> => {
      const {
        limit = DEFAULT_ACTIVITIES_LIMIT,
        offset = DEFAULT_ACTIVITIES_OFFSET,
      } = params;

      const searchParams = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });

      const response = await authFetch(`/api/recent-activities?${searchParams}`);

      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData.message || errorData.error || "Failed to fetch recent activities";
        throw new Error(message);
      }

      return response.json();
    },
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
    ...options,
  });
};

export const useRefreshActivities = () => {
  const queryClient = useQueryClient();

  return useMutation<
    RecentActivitiesResponse,
    Error,
    RecentActivitiesParams
  >({
    mutationFn: async (params: RecentActivitiesParams = {}) => {
      const {
        limit = DEFAULT_ACTIVITIES_LIMIT,
        offset = DEFAULT_ACTIVITIES_OFFSET,
      } = params;

      const searchParams = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });

      const response = await authFetch(`/api/recent-activities?${searchParams}`);

      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData.message || errorData.error || "Failed to fetch recent activities";
        throw new Error(message);
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(QUERY_KEYS.recentActivities(variables), data);
      toast.success("Atividades atualizadas com sucesso");
    },
    onError: (error) => {
      const message = error.message || "Erro ao atualizar atividades";
      toast.error(message);
      Sentry.captureException(error, {
        tags: {
          component: "dashboard-hooks",
          hook: "useRefreshActivities",
        },
        extra: {
          action: "refresh_activities_mutation",
        },
      });
    },
  });
};

export const useInvalidateActivities = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({
      queryKey: ["recent-activities"],
    });
  };
};