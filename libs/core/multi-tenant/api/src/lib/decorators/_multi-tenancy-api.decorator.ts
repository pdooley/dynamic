import { AppType } from '@vsolv/core/multi-tenant/domain';

export let currentAppType = AppType.BASIC;
/**Sets the current app type. Only used inside the multitenancy library when APP_TYPE provider is not accessible */
export function setCurrentAppType(appType: AppType) {
  currentAppType = appType;
}
