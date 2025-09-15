// Local types for recent activities API
export interface Activity {
  id: string;
  action: string;
  timestamp: string;
  details: string;
  status: "success" | "warning" | "error";
  user?: string;
}