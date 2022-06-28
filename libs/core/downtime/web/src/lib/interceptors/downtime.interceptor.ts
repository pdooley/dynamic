/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, throwError } from 'rxjs';

import { isVectorSolvRequest } from '@vsolv/dev-kit/ngx';

/** This interceptor is meant to redirect the user to the service unavailable page*/
@Injectable()
export class DowntimeInterceptor implements HttpInterceptor {
  constructor(private snacks: MatSnackBar) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (isVectorSolvRequest(req, true)) {
      return next.handle(req);
    }

    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        this.handleResponse(err);
        return throwError(() => new Error(err.statusText));
      })
    );
  }

  /** Incoming responses are intercepted and scanned for error 503, Service Unavailable */
  private handleResponse(response: HttpErrorResponse) {
    if (response.status === 503) {
      //TODO: REDIRECT
      window.open('https://www.youtube.com/watch?v=bHX54GCrDB4', '_blank');
      this.snacks.open('Servers are down for maintenance', 'Ok', { duration: 6000, panelClass: 'warn' });
    }
  }
}
