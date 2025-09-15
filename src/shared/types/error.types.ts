export interface FetchError extends Error {
  status: number;
  statusText: string;
}

export interface ApiError extends Error {
  code?: string;
  details?: unknown;
}

export interface ValidationError extends Error {
  field: string;
  value: unknown;
}