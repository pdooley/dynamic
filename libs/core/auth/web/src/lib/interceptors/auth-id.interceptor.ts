/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

import { isVectorSolvRequest } from '@vsolv/dev-kit/ngx';

import { AUTH_HANDLER } from '../constants';
import { AuthHandlerService } from '../services';

/** This interceptor attempts to add the auth token to the header */
@Injectable()
export class AuthIdInterceptor implements HttpInterceptor {
  constructor(@Inject(AUTH_HANDLER) private authHandlerSvc: AuthHandlerService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (isVectorSolvRequest(req, true)) {
      return this.authHandlerSvc.getAuthToken$().pipe(
        switchMap(idToken => {
          return next.handle(
            req.clone({
              setHeaders: {
                Authorization: `Bearer ${idToken}`,
              },
            })
          );
        })
      );
    }
    return next.handle(req);
  }
}
