import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

import { Tenant } from '@vsolv/core/multi-tenant/domain';
import { PaginationQueryRequest, PaginationQueryResponse } from '@vsolv/dev-kit/nest';
import { PropertyListener } from '@vsolv/dev-kit/rx';

@Injectable({
  providedIn: 'root',
})
export class TenantService {
  constructor(private http: HttpClient) {}
  baseUrl = '/platform-api';

  @PropertyListener('tenantId') tenantId$ = new BehaviorSubject<string | undefined>(undefined);
  tenantId?: string;

  async getAll() {
    return await firstValueFrom(this.http.get<Tenant[]>(`${this.baseUrl}/tenants`));
  }

  async getOne(id: string) {
    return await firstValueFrom(this.http.get<Tenant>(`${this.baseUrl}/tenants/${id}`));
  }

  async setTenantId(id?: string) {
    this.tenantId = id;
    return this.tenantId;
  }

  async paginate(pagination?: PaginationQueryRequest) {
    return await firstValueFrom(
      this.http.get<PaginationQueryResponse<Tenant>>(`${this.baseUrl}/tenants/paginate`, {
        params: {
          page: pagination?.page || 1,
          limit: pagination?.limit || 10,
        },
      })
    );
  }

  async create(name: string) {
    return await firstValueFrom(this.http.post<Tenant>(`${this.baseUrl}/tenants`, { name }));
  }

  async update(id: string, dto: { name: string }) {
    return await firstValueFrom(this.http.patch<Tenant>(`${this.baseUrl}/tenants/${id}`, dto));
  }
}
