/**The platform record of all users and the authorization(s) they belong under */
export interface AuthUser {
  userId: string;
  authId: string;
  /**The tenant (if applicable) the user belongs to */
  tenantId?: string;
  /**Determines if this user should be retrieved on sign in and/or requests */
  default: boolean;
}
