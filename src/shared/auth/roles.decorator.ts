import { SetMetadata } from '@nestjs/common';

export const ROLES = {
  PARENT: 'parent',
  TEACHER: 'teacher',
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
