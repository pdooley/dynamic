import { getTenantIdFromRequestHeader } from '../middleware';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/** This decorator can be used in controller methods to pass down the tenant id that is in the request header*/
export const VSolvTenantId = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const tenantId = getTenantIdFromRequestHeader(request);
  return tenantId || undefined;
});
