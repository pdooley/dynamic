import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL, PLATFORM_API_BASE_URL } from './api-interceptor.token';
import { ORIGIN_HEADER } from './origin-header.token';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  private readonly baseUrl: string;
  private readonly platformBaseUrl: string;

  constructor(@Inject(API_BASE_URL) baseUrl: string, @Inject(PLATFORM_API_BASE_URL) platformBaseUrl: string) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.substring(0, baseUrl.length - 1) : baseUrl;
    this.platformBaseUrl = platformBaseUrl.endsWith('/')
      ? platformBaseUrl.substring(0, platformBaseUrl.length - 1)
      : platformBaseUrl;
  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (req.url.startsWith('/api') || req.url.startsWith('/v1')) {
      const request = this.cloneRequestWithFullUrl(this.baseUrl, req);
      return next.handle(request);
    } else if (req.url.startsWith('/platform-api') || req.url.startsWith('/platform-v1')) {
      const request = this.cloneRequestWithFullUrl(this.platformBaseUrl, req, 'vectorsolv-platform');
      return next.handle(request);
    } else {
      return next.handle(req);
    }
  }

  private cloneRequestWithFullUrl(
    baseUrl: string,
    request: HttpRequest<unknown>,
    originHeader: 'vectorsolv' | 'vectorsolv-platform' = 'vectorsolv'
  ) {
    return request.clone({
      url: baseUrl + request.url.replace('/platform-', '/').replace('api', 'v1'),
      headers: request.headers.set(ORIGIN_HEADER, originHeader), //This header is to distinguish our api calls for other multi-tenant interceptors
    });
  }
}

export function isVectorSolvRequest(req: HttpRequest<unknown>, allowPlatform: boolean = true) {
  return (
    req.headers.get(ORIGIN_HEADER) === 'vectorsolv' ||
    (allowPlatform && req.headers.get(ORIGIN_HEADER) === 'vectorsolv-platform')
  );
}
