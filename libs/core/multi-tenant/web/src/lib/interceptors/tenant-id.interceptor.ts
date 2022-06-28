/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { MultiTenancyConstants } from '@vsolv/core/multi-tenant/domain';
import { isVectorSolvRequest } from '@vsolv/dev-kit/ngx';
import { TenantInfoService, TenantService } from '../services';

export const REQUIRE_TENANT_ID = new InjectionToken<boolean>('REQUIRE_TENANT_ID');

/** This interceptor attempts to add the tenant id to request headers and retrieve tenant id from response headers */
@Injectable()
export class TenantIdInterceptor implements HttpInterceptor {
  constructor(
    private localTenant: TenantInfoService,
    private tenantSvc: TenantService,
    @Inject(REQUIRE_TENANT_ID) private requireTenant: boolean
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (isVectorSolvRequest(req, false)) {
      return next.handle(this.handleRequest(req)).pipe(
        tap(event => {
          if (event instanceof HttpResponse) {
            this.handleResponse(event);
          }
        })
      );
    }
    return next.handle(req);
  }

  /** Interceptor attempts to retrieve the tenant id from local storage and add it to the outgoing vectorsolv api request's headers  */
  private handleRequest(request: HttpRequest<any>) {
    const tenantId = this.tenantSvc.tenantId || this.localTenant.getLocalTenantId();
    console.log(tenantId);
    if (!tenantId && this.requireTenant) throw new Error('No tenant id found, cannot make request to API');
    return tenantId
      ? request.clone({ setHeaders: { [MultiTenancyConstants.TENANT_ID_HEADER_KEY]: tenantId } })
      : request;
  }

  /** Incoming responses are intercepted and scanned for a tenant id in the headers to update local storage */
  private handleResponse(response: HttpResponse<any>) {
    const resTenantId = response.headers.get(MultiTenancyConstants.TENANT_ID_HEADER_KEY);
    if (resTenantId) {
      this.localTenant.setLocalTenantId(resTenantId);
      this.tenantSvc.setTenantId(resTenantId);
    }
  }
}
