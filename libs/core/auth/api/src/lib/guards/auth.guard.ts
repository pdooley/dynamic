import { ExecutionContext, mixin } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { firstValueFrom, isObservable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators';

/**Uses the provided strategy to determine if the request is authenticated (unless declared public). Also validates current app type with the request */
export function VSolvAuthGuard(strategy: string | string[]) {
  return mixin(
    class extends AuthGuard(strategy) {
      constructor(public reflector: Reflector) {
        super({ property: 'authInfo' });
      }

      async canActivate(context: ExecutionContext) {
        try {
          const canActivate = super.canActivate(context);
          const result = await (isObservable(canActivate) ? firstValueFrom(canActivate) : canActivate);
          if (this.isPublic(context)) return true;
          else return result;
        } catch (err) {
          //console.error(err);
          return this.isPublic(context);
        }
      }

      isPublic(context: ExecutionContext) {
        return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
      }

      // validateTenancy(context: ExecutionContext) {
      //   //TODO: should this be in a tenancy guard?
      //   const decorator = this.reflector.getAllAndOverride<boolean>(MultiTenancyConstants.APP_TYPE, [
      //     context.getHandler(),
      //     context.getClass(),
      //   ]);
      //   const appType = context.switchToHttp().getRequest()[MultiTenancyConstants.APP_TYPE];
      //   return decorator ? decorator === appType : true;
      // }
    }
  );
}
