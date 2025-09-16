import { JWTPayload } from "jose";
export interface TokenPayload extends JWTPayload {
  userId: string;
  jti?: string;
}
export interface SessionData {
  isAuth: true;
  userId: string;
}
export interface UserProfile {
  name: string | null;
  email: string | null;
  memberSince: string | null;
}

