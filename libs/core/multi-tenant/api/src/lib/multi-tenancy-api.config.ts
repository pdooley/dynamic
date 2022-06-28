import { CacheManagerOptions, Type } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppType } from '@vsolv/core/multi-tenant/domain';
import { MigrationInterface } from 'typeorm';

export interface MultiTenancyApiConfig {
  type: AppType;
  platform_connection: TypeOrmModuleOptions;
}
export class MultiTenancyPlatformApiConfig implements MultiTenancyApiConfig {
  constructor(
    platform_connection: TypeOrmModuleOptions,
    default_tenant_connection: TypeOrmModuleOptions,
    migrations: Type<MigrationInterface>[]
  ) {
    this.type = AppType.PLATFORM;
    this.platform_connection = platform_connection;
    this.default_tenant_connection = default_tenant_connection;
    this.migrations = migrations;
  }
  readonly type: AppType = AppType.PLATFORM;
  platform_connection: TypeOrmModuleOptions;
  default_tenant_connection: TypeOrmModuleOptions;
  migrations: Type<MigrationInterface>[];
}
export class MultiTenancyTenantApiConfig implements MultiTenancyApiConfig {
  constructor(
    platform_connection: TypeOrmModuleOptions,
    default_tenant_connection: TypeOrmModuleOptions,
    isSandbox: boolean,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cacheStoreconfig: CacheManagerOptions & Record<any, any> = {}
  ) {
    this.type = AppType.TENANT;
    this.platform_connection = platform_connection;
    this.default_tenant_connection = default_tenant_connection;
    this.cacheStoreconfig = cacheStoreconfig;
    this.isSandbox = isSandbox;
  }
  readonly type: AppType = AppType.TENANT;
  platform_connection: TypeOrmModuleOptions;
  default_tenant_connection: TypeOrmModuleOptions;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cacheStoreconfig: CacheManagerOptions & Record<any, any> = {};
  isSandbox: boolean;
}
