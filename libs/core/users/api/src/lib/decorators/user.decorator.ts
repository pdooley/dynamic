import { UserEntity } from '../entities';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/** This decorator can be used in controller methods to pass down the user id that is in the request*/
export const VSolvUser = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user as UserEntity | undefined;
  return user;
});
