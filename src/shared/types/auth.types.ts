import { JWTPayload } from "jose";

// Core token payload interface used across session and auth modules
export interface TokenPayload extends JWTPayload {
  userId: string;
  email?: string;
  jti?: string;
}

// Session data interface used in DAL
export interface SessionData {
  isAuth: true;
  userId: string;
  email?: string;
}

// User profile interface
export interface UserProfile {
  name: string | null;
  email: string | null;
  memberSince: string | null;
}