import { SetMetadata } from '@nestjs/common';

export const BYPASS_TENANT = 'bypassTenant';
export const PLATFORM_ENDPOINT = 'BypassTenant';
/**Used on a controller or endpoint to bypass tenant id authorization */
export const BypassTenant = (): MethodDecorator => (target, propertyKey, descriptor) => {
  SetMetadata(BYPASS_TENANT, true)(target, propertyKey, descriptor);
};
