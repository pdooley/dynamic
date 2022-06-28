import { Downtime } from '@vsolv/core/downtime/domain';
import { BaseVsolvEntity } from '@vsolv/dev-kit/nest';
import { Column, PrimaryColumn } from 'typeorm';

@BaseVsolvEntity({ name: 'downtime' }, 'platform')
export class DowntimeEntity implements Downtime {
  @PrimaryColumn({ type: 'bigint' })
  id!: number;

  @Column()
  start!: Date;

  @Column({ nullable: true })
  completed?: Date | undefined;
}
