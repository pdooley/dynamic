import { DowntimeService } from '../services';
import { CanActivate, ServiceUnavailableException } from '@nestjs/common';

export class DowntimeGuard implements CanActivate {
  constructor(private downtimeSvc: DowntimeService) {}

  async canActivate() {
    const downtime = await this.downtimeSvc.getDowntimeStatus();
    if (downtime) throw new ServiceUnavailableException('Under Maintenance', 'Servers are under maintenance');
    return true;
  }
}
