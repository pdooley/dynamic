import { SetMetadata } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

export const IS_PUBLIC_KEY = 'isPublic';
/**Used on a controller or endpoint to bypass authorization */
export const Public = (): MethodDecorator => (target, propertyKey, descriptor) => {
  SetMetadata(IS_PUBLIC_KEY, true)(target, propertyKey, descriptor);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentOptions = descriptor.value ? Reflect.getMetadata('swagger/apiOperation', descriptor.value) : null;
  ApiOperation({ ...(currentOptions || {}), security: [] })(target, propertyKey, descriptor);
};
