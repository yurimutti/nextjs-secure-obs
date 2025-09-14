export interface Activity {
  id: string;
  action: string;
  timestamp: string;
  details: string;
  status: 'success' | 'warning' | 'error';
  user?: string;
}

export interface RecentActivitiesResponse {
  activities: Activity[];
  total: number;
  hasMore: boolean;
}

export interface RecentActivitiesParams {
  limit?: number;
  offset?: number;
}