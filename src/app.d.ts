import type { UserWithRole } from '@/user';
import type { Session } from 'better-auth';

declare global {
  namespace App {
    interface Locals {
      session?: Session;
      user?: UserWithRole;
    }
  }
}

export {};
