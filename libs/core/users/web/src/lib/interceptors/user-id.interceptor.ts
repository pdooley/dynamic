/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';

import { AuthService } from '@vsolv/core/auth/web';
import { USER_HEADER } from '@vsolv/core/users/domain';
import { isVectorSolvRequest } from '@vsolv/dev-kit/ngx';

import { UserStorageService } from '../services';

/** This interceptor attempts to add the user id from session storage to the header */
@Injectable()
export class UserIdInterceptor implements HttpInterceptor {
  constructor(private userStorageSvc: UserStorageService, private authSvc: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (isVectorSolvRequest(req, true)) {
      return this.authSvc.getAuthId$().pipe(
        switchMap(authId => {
          return next.handle(this.cloneRequestWithUser(req, authId)).pipe(
            tap(event => {
              if (event instanceof HttpResponse && authId) {
                this.handleResponse(authId, event);
              }
            })
          );
        })
      );
    }
    return next.handle(req);
  }
  cloneRequestWithUser(req: HttpRequest<any>, authId?: string) {
    if (!authId) return req;
    const signedInUser = this.userStorageSvc.getSignedInUser(authId);
    if (signedInUser) {
      return req.clone({
        setHeaders: { [USER_HEADER]: signedInUser.userId },
      });
    } else return req;
  }
  handleResponse(authId: string, response: HttpResponse<any>) {
    const resUserId = response.headers.get(USER_HEADER);
    if (resUserId) {
      const storedUser = this.userStorageSvc.getSignedInUser(authId);
      if (storedUser?.userId !== resUserId) this.userStorageSvc.setSignedInUser(resUserId, authId);
    }
  }
}
