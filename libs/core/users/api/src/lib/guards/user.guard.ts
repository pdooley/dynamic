import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '@vsolv/core/auth/api';
import { AuthInfo } from '@vsolv/core/auth/domain';
import { getTenantIdFromRequestHeader } from '@vsolv/core/multi-tenant/api';
import { USER_HEADER } from '@vsolv/core/users/domain';
import { Request } from 'express';
import { AuthUserService } from '../services';

export class UserGuard extends AuthGuard('user') {
  constructor(private authUserSvc: AuthUserService, public reflector: Reflector) {
    super({ property: 'user' });
  }
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    if (req.authInfo && req.authInfo !== 'Unauthorized') {
      //ensure user id is in request
      const hasUser = await this.ensureUserInRequest(req);
      return hasUser || this.isPublic(context);
    }
    return true;
  }

  private async ensureUserInRequest(req: Request): Promise<boolean> {
    //get user id in request
    let userId = getUserIdFromRequestHeader(req);
    const tenantId = getTenantIdFromRequestHeader(req);
    if (!userId) {
      //no user id in request
      userId = await this.getUserIdByAuth(req, tenantId); //get default user of auth
      req.headers[USER_HEADER] = userId;
    } else if (!(await this.verifyUserId(req, userId, tenantId))) {
      return false;
    }

    req.user = userId;
    // response.header(USER_HEADER, userId);
    // response.header('Access-Control-Expose-Headers', USER_HEADER);

    return true;
  }

  /**When a user id is not provided in the headers of the request, this function is used to utilize the auth info of the request */
  private async getUserIdByAuth(request: Request, tenantId?: string) {
    const authInfo = request.authInfo as AuthInfo;
    return (await this.authUserSvc.getDefaultForAuth(authInfo.id, tenantId))?.userId || undefined;
  }

  private async verifyUserId(req: Request, userId: string, tenantId?: string) {
    const authId = (req.authInfo as AuthInfo).id;
    const authUser = await this.authUserSvc.getOneByUser(authId, userId, tenantId);
    if (authUser) return true;
    return false;
  }
  isPublic(context: ExecutionContext) {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
  }
}
/** Looks in the request header for a provided user id*/
export function getUserIdFromRequestHeader(request: Request) {
  return (request.headers[USER_HEADER] || request.headers[USER_HEADER.toLowerCase()]) as string | undefined;
}
