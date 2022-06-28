import { SetMetadata } from '@nestjs/common';

export const IGNORE_DOWNTIME_KEY = 'ignoreDowntime';
/**Used on a controller or endpoint to bypass downtime check */
export const IgnoreDowntime = () => SetMetadata(IGNORE_DOWNTIME_KEY, true);
