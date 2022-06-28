import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { plainToInstance } from 'class-transformer';
import { BehaviorSubject, catchError, firstValueFrom, interval, of, shareReplay, startWith, switchMap } from 'rxjs';

import { MultiTenancyConstants, TenantInfo } from '@vsolv/core/multi-tenant/domain';

@Injectable({ providedIn: 'root' })
export class TenantInfoService {
  private refresh$ = new BehaviorSubject<null>(null);
  private _tenantInfo$ = this.refresh$.pipe(switchMap(() => this.ensureTenantInfo()));

  // Force refresh every 1hr
  readonly tenantInfo$ = interval(3600000).pipe(
    startWith(-1),
    switchMap(() => this._tenantInfo$),
    shareReplay(1)
  );

  constructor(private http: HttpClient) {}

  refreshTenantInfo() {
    this.refresh$.next(null);
  }

  getLocalTenantId() {
    return localStorage.getItem(MultiTenancyConstants.TENANT_ID_LOCAL_STORAGE_KEY);
  }

  setLocalTenantId(tenantId: string | null) {
    if (tenantId) localStorage.setItem(MultiTenancyConstants.TENANT_ID_LOCAL_STORAGE_KEY, tenantId);
    else localStorage.removeItem(MultiTenancyConstants.TENANT_ID_LOCAL_STORAGE_KEY);
  }

  private getInfoExpiry() {
    try {
      const expiry = localStorage.getItem(MultiTenancyConstants.TENANT_INFO_EXPIRY_LOCAL_STORAGE_KEY);
      return expiry ? Number(expiry) : 0;
    } catch {
      return 0;
    }
  }

  private getLocalTenantInfo(): TenantInfo | null {
    const infoStr = localStorage.getItem(MultiTenancyConstants.TENANT_INFO_LOCAL_STORAGE_KEY);
    if (!infoStr) return null;

    try {
      return plainToInstance(TenantInfo, JSON.parse(infoStr));
    } catch {
      return this.setLocalTenantInfo(null);
    }
  }

  private setLocalTenantInfo(info: TenantInfo | null) {
    if (info) {
      localStorage.setItem(MultiTenancyConstants.TENANT_INFO_LOCAL_STORAGE_KEY, JSON.stringify(info));
      const expiry = Date.now() + 10 * 24 * 60 * 60 * 1000; // In 10 days
      localStorage.setItem(MultiTenancyConstants.TENANT_INFO_EXPIRY_LOCAL_STORAGE_KEY, '' + expiry);
    } else {
      localStorage.removeItem(MultiTenancyConstants.TENANT_INFO_LOCAL_STORAGE_KEY);
      localStorage.removeItem(MultiTenancyConstants.TENANT_INFO_EXPIRY_LOCAL_STORAGE_KEY);
    }

    return info;
  }

  private async getCloudTenantInfo(persist = true): Promise<TenantInfo | null> {
    const info = await firstValueFrom(this.http.get<TenantInfo>(`/api/tenant`).pipe(catchError(() => of(null))));
    if (persist) this.setLocalTenantInfo(info);
    return info;
  }

  private async ensureTenantInfo(): Promise<TenantInfo | null> {
    if (this.getInfoExpiry() <= Date.now()) return await this.getCloudTenantInfo();
    return this.getLocalTenantInfo() ?? (await this.getCloudTenantInfo());
  }
}
