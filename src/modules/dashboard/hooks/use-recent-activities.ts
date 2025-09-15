import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as Sentry from "@sentry/nextjs";

import type {
  RecentActivitiesResponse,
  RecentActivitiesParams,
} from "@/modules/dashboard/types/activity";
import toast from "react-hot-toast";

import { authFetch } from "@/modules/auth/utils/auth-fetch";

import {
  QUERY_KEYS,
  QUERY_STALE_TIME,
  QUERY_GC_TIME,
  DEFAULT_ACTIVITIES_LIMIT,
  DEFAULT_ACTIVITIES_OFFSET,
} from "../constants";

async function fetchRecentActivities(
  params: RecentActivitiesParams = {}
): Promise<RecentActivitiesResponse> {
  const {
    limit = DEFAULT_ACTIVITIES_LIMIT,
    offset = DEFAULT_ACTIVITIES_OFFSET,
  } = params;

  const searchParams = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });

  const response = await authFetch(`/api/recent-activities?${searchParams}`);

  // TODO: improve this error handling
  // if (!response.ok) {
  //   const error = new Error("Failed to fetch recent activities") as Error & {
  //     status: number;
  //   };
  //   error.status = response.status;

  //   toast.error(`Error ${response.status}: ${response.statusText}`);

  //   Sentry.captureException(error, {
  //     tags: {
  //       component: "dashboard-hooks",
  //       hook: "useRecentActivities",
  //     },
  //     extra: {
  //       action: "fetch_recent_activities",
  //     },
  //   });

  //   throw error;
  // }

  return response.json();
}

export function useRecentActivities(params: RecentActivitiesParams = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.recentActivities(params),
    queryFn: () => fetchRecentActivities(params),
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
  });
}

export function useRefreshActivities() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: RecentActivitiesParams = {}) => {
      return fetchRecentActivities(params);
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(QUERY_KEYS.recentActivities(variables), data);
    },
    onError: (error) => {
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
}

export function useInvalidateActivities() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({
      queryKey: ["recent-activities"],
    });
  };
}
