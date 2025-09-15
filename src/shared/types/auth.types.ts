import { JWTPayload } from "jose";
export interface TokenPayload extends JWTPayload {
  userId: string;
  email?: string;
  jti?: string;
}
export interface SessionData {
  isAuth: true;
  userId: string;
  email?: string;
}
export interface UserProfile {
  name: string | null;
  email: string | null;
  memberSince: string | null;
}

