import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { MultiTenancyConstants } from '@vsolv/core/multi-tenant/domain';
import { NextFunction, Request, Response } from 'express';
import { Connection } from 'typeorm';
import { TenantEntity } from '../entities';
import { TenantCacheService } from '../services';

export function getDomainFromRequest(request: Request) {
  const url = new URL(request.get('origin'));
  return url.host.replace('www.', '').replace('.vectorsolv.com', '');
  // Note: Removed the localhost logic to prevent collisions with existing subdomains (it will be 'localhost:4201' instead of '4201')
}

/** Ensures that a tenant id is in the header of the request. If not provided, it utilizes the request's domain to get the tenant id from the cache or repo */
@Injectable()
export class TenantIdMiddleware implements NestMiddleware {
  constructor(
    @InjectConnection('platform_db') private platformConnection: Connection,
    private tenantCacheService: TenantCacheService
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    await this.ensureTenantIdHeader(req, res).catch(() => null);
    //if (!tenantId) res.status(400).send('Invalid tenant id'); //moved to tenant guard
    //else next();
    next();
  }

  /**This function attempts to ensure a tenant id is in the header. If one is not provided, it attempts to add one with getRequestTenantId*/
  private async ensureTenantIdHeader(request: Request, response: Response) {
    let tenantId = getTenantIdFromRequestHeader(request);
    if (!tenantId) {
      tenantId = await this.getRequestTenantId(request);
      request.headers[MultiTenancyConstants.TENANT_ID_HEADER_KEY] = tenantId;
    }

    response.header(MultiTenancyConstants.TENANT_ID_HEADER_KEY, tenantId);
    response.header('Access-Control-Expose-Headers', MultiTenancyConstants.TENANT_ID_HEADER_KEY);

    return tenantId;
  }

  /**When a tenant id is not provided in the headers of the request, this function is used to utilize the domain of the request and query the cache or platform connection for a tenant registered to the domain  */
  private async getRequestTenantId(request: Request): Promise<string | undefined> {
    const domain = getDomainFromRequest(request);
    if (domain === 'localhost:4200') return 'demo';
    // Directly retrieving tenant ID to minimize amount of cached data (expensive stuff)
    const cachedTenantId = await this.tenantCacheService.getCachedTenant(domain);
    if (cachedTenantId) return cachedTenantId;

    const repo = this.platformConnection.getRepository(TenantEntity);
    const query = repo.createQueryBuilder('t').select('t.id', 'id').where('t.domain = :domain', { domain });

    const tenant = await query.getRawOne<{ id: string }>();
    if (tenant) this.tenantCacheService.setCachedTenant(domain, tenant.id);

    return tenant?.id;
  }
}
/** Request headers may or may not be case sensitive depending on their origin. This function is used by functions outside of the middleware accessing the request for the tenant id */
export function getTenantIdFromRequestHeader(request: Request) {
  const tenantId =
    request.headers[MultiTenancyConstants.TENANT_ID_HEADER_KEY] ||
    request.headers[MultiTenancyConstants.TENANT_ID_HEADER_KEY.toLowerCase()];

  // We are not expecting it to be an array but still handling just in case
  return Array.isArray(tenantId) ? tenantId.join() : tenantId;
}
