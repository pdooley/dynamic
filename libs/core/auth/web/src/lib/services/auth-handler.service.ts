import { Observable } from 'rxjs';

/**Abstract class that all auth strategy services need to extend */
export abstract class AuthHandlerService {
  abstract getAuthId$(): Observable<string | undefined>;
  abstract getAuthToken$(): Observable<string | null>;
  abstract isSignedIn$(): Observable<boolean>;
  abstract signOut(): Promise<void>;
  abstract signIn(email: string, password: string): Promise<unknown>;

  abstract register(
    email: string,
    password: string,
    info?: { displayName?: string; phoneNumber?: string }
  ): Promise<unknown>;
  abstract resetPassword(email: string): Promise<void>;

  abstract sendResetPasswordEmail(email: string): Promise<void>;

  abstract sendEmailVerification(): Promise<void>;

  abstract changePassword(oldPassword: string, newPassword: string): Promise<string>;
}
