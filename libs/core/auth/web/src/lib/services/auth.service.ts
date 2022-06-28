import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AUTH_HANDLER } from '../constants';
import { AuthHandlerService } from './auth-handler.service';

/**Uses the provided auth strategy to perform the basic authorization functions */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(@Inject(AUTH_HANDLER) private handlerSvc: AuthHandlerService, private http: HttpClient) {}

  // async paginate() {
  //   return await firstValueFrom(this.http.get<PaginatedDto<AuthUser>>(`/api/auth-user/paginate`));
  // }

  getAuthId$() {
    return this.handlerSvc.getAuthId$();
  }
  getAuthToken$(): Observable<string | null> {
    return this.handlerSvc.getAuthToken$();
  }
  isSignedIn$(): Observable<boolean> {
    return this.handlerSvc.isSignedIn$();
  }
  async signOut(): Promise<void> {
    return await this.handlerSvc.signOut();
  }
  async signIn(email: string, password: string) {
    return await this.handlerSvc.signIn(email, password);
  }

  async register(email: string, password: string, info?: { displayName?: string; phoneNumber?: string }) {
    return await this.handlerSvc.register(email, password, info);
  }
  async resetPassword(email: string) {
    return await this.handlerSvc.resetPassword(email);
  }

  async sendResetPasswordEmail(email: string) {
    return await this.handlerSvc.sendResetPasswordEmail(email);
  }

  async sendEmailVerification() {
    return await this.handlerSvc.sendEmailVerification();
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<string> {
    return await this.handlerSvc.changePassword(oldPassword, newPassword);
  }
}
