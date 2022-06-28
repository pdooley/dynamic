import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/** This decorator can be used in controller methods to pass down the auth record that is in the request*/
export const VSolvAuthInfo = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const authInfo = request.authInfo;
  return authInfo || undefined;
});
