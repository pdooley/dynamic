import { Inject, Injectable } from '@nestjs/common';
import { PLATFORM_CONNECTION_NAME } from '@vsolv/core/multi-tenant/api';
import { getConnection, IsNull, LessThanOrEqual, MoreThan } from 'typeorm';
import { DowntimeEntity } from '../entities';

@Injectable()
export class DowntimeService {
  constructor(@Inject(PLATFORM_CONNECTION_NAME) private platformConName: { value: string | undefined }) {}

  async getDowntimeStatus() {
    const platformConnection = getConnection(this.platformConName.value);
    return await platformConnection.transaction(async manager => {
      const now = new Date();
      return await manager.findOne(DowntimeEntity, {
        where: [
          { completed: IsNull(), start: LessThanOrEqual(now) },
          { completed: MoreThan(now), start: LessThanOrEqual(now) },
        ],
        // cache: true,
      });
    });
  }

  async createDowntime(startDate?: Date) {
    const platformConnection = getConnection(this.platformConName.value);
    const now = new Date();
    return await platformConnection.transaction(async manager => {
      return await manager.save(
        manager.create(
          DowntimeEntity,
          startDate ? { id: startDate.getTime(), start: startDate } : { id: now.getTime(), start: now }
        )
      );
    });
  }
  async completeDowntime(id: number) {
    const platformConnection = getConnection(this.platformConName.value).manager;
    return await platformConnection
      .createQueryBuilder()
      .update(DowntimeEntity)
      .set({ completed: new Date() })
      .where({ id })
      .execute();
  }
}
