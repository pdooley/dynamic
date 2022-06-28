import { IsString } from 'class-validator';
import type { ConnectionOptions } from 'typeorm';

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  connection: ConnectionOptions;
  sandboxConnection: ConnectionOptions;
}

export interface TenantInfo {
  name: string;
}

export class TenantInfo {
  @IsString()
  name!: string;
}
