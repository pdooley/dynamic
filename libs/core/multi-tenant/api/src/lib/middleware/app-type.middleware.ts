import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { AppType, MultiTenancyConstants } from '@vsolv/core/multi-tenant/domain';
import { NextFunction, Request, Response } from 'express';
import { APP_TYPE, IS_SANDBOX } from '../symbols';
//
/** Ensures that the app type is placed in the headers of the request */
@Injectable()
export class AppTypeMiddleware implements NestMiddleware {
  constructor(@Inject(APP_TYPE) private appType: AppType, @Inject(IS_SANDBOX) private isSandbox: boolean) {}

  async use(req: Request, res: Response, next: NextFunction) {
    req[MultiTenancyConstants.APP_TYPE] = this.appType;
    req[MultiTenancyConstants.IS_SANDBOX] = this.isSandbox;
    next();
  }
}
