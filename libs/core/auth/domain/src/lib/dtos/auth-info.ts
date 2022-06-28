/**Information about the authorization user */
export interface AuthInfo {
  id: string;
  emailVerified?: boolean;
  email?: string;
  phoneNumber?: string;
  displayName?: string;
  photoUrl?: string;
}
