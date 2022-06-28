import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { getTenantIdFromRequestHeader } from '../middleware';

export class TenantGuard extends AuthGuard('tenant') {
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const tenantId = getTenantIdFromRequestHeader(req);
    if (tenantId) return true;
    if (!tenantId) res.status(400).send('Invalid tenant id');
    return false;
  }
}
