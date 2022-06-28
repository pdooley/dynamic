import { getUserIdFromRequestHeader } from '../guards';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/** This decorator can be used in controller methods to pass down the user id that is in the request*/
export const VSolvUserId = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const userId = getUserIdFromRequestHeader(request);
  return userId;
});
