import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { ApiInterceptor } from './api-interceptor.interceptor';
import { API_BASE_URL, PLATFORM_API_BASE_URL } from './api-interceptor.token';

@NgModule()
export class ApiInterceptorModule {
  static forRoot(apiBaseUrl: string): ModuleWithProviders<ApiInterceptorModule> {
    return {
      ngModule: ApiInterceptorModule,
      providers: [
        { provide: API_BASE_URL, useValue: apiBaseUrl },
        { provide: PLATFORM_API_BASE_URL, useValue: apiBaseUrl },
        { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
      ],
    };
  }
  static forTenantRoot(tenantApi: string, platformApi: string): ModuleWithProviders<ApiInterceptorModule> {
    return {
      ngModule: ApiInterceptorModule,
      providers: [
        { provide: API_BASE_URL, useValue: tenantApi },
        { provide: PLATFORM_API_BASE_URL, useValue: platformApi },
        { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
      ],
    };
  }
}
