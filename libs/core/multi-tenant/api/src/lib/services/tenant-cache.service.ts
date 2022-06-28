import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Connection } from 'typeorm';

import { MultiTenancyConstants, TenantInfo } from '@vsolv/core/multi-tenant/domain';

import { TenantEntity } from '../entities';

/** This is a tenant-side service used to cache the domain/tenant id relation and to return the tenant information when requested*/
@Injectable()
export class TenantCacheService {
  constructor(
    @InjectConnection(MultiTenancyConstants.PLATFORM_DB_CONNECTION_NAME) private platformConnection: Connection,
    @Inject(CACHE_MANAGER) private cache: Cache
  ) {}

  async getTenantInfo(id: string): Promise<TenantInfo> {
    if (id === 'demo') return { name: 'Demo' }; // TODO: Do we really need this? //TODO:This is only to test the "default" connection
    const tenant = await this.platformConnection.getRepository(TenantEntity).findOne(id);
    if (tenant) this.setCachedTenant(tenant.domain, tenant.id);
    return tenant ? { name: tenant.name } : undefined;
  }

  getCachedTenant(domain: string): Promise<string> {
    return this.cache.get<string>(`domain_${domain}`);
  }

  setCachedTenant(domain: string, id: string): Promise<string> {
    return this.cache.set(`domain_${domain}`, id); // Note: No need to await for this
  }
}
