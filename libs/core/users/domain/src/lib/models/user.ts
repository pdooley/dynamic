import { Address } from '@vsolv/dev-kit/domain';

export interface User {
  id: string;

  isSuperAdmin: boolean;

  created: Date;
  modified: Date;

  email?: string;
  emailVerified: boolean;

  phoneNumber?: string;

  displayName?: string;
  friendlyName?: string;
  photoURL?: string;

  address?: Address;
  birthday?: Date;
}
