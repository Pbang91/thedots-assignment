import { UserRole } from "./roles.decorator";

export interface JwtPayload {
  id?: string;
  role: UserRole;
}