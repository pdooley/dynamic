import { Tenant } from '@vsolv/core/multi-tenant/domain';
import { VsolvEntity } from '@vsolv/dev-kit/nest';
import { Column, ConnectionOptions, PrimaryColumn } from 'typeorm';

@VsolvEntity({ name: 'tenant', prefix: 'tnt' }, 'platform')
export class TenantEntity implements Tenant {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  domain: string;

  @Column({ type: 'simple-json' })
  connection: ConnectionOptions;
  @Column({ type: 'simple-json' })
  sandboxConnection: ConnectionOptions;
}
