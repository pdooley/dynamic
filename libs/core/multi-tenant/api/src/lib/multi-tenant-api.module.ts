import { CacheManagerOptions, CacheModule, Module, Type } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppType, MultiTenancyConstants } from '@vsolv/core/multi-tenant/domain';
import { MigrationInterface } from 'typeorm';
import { TenantController } from './controllers';
import { TenantInfoController } from './controllers/tenant-info.controller';
import { setCurrentAppType } from './decorators/_multi-tenancy-api.decorator';
import { TenantEntity } from './entities';
import { TenantGuard } from './guards';
import {
  MultiTenancyApiConfig,
  MultiTenancyPlatformApiConfig,
  MultiTenancyTenantApiConfig,
} from './multi-tenancy-api.config';
import { TenantCacheService, TenantService } from './services';
import { APP_TYPE, IS_SANDBOX, PLATFORM_CONNECTION_NAME, TENANT_MIGRATIONS } from './symbols';

@Module({
  controllers: [],
  imports: [],
})
export class MultiTenantApiModule {
  /** Registers the app type as PLATFORM and provides the migrations for tenant database creation*/
  static forPlatformRoot(migrations: Type<MigrationInterface>[]) {
    setCurrentAppType(AppType.PLATFORM);
    return {
      global: true,
      module: MultiTenantApiModule,
      controllers: [TenantController],
      providers: [
        { provide: APP_TYPE, useValue: AppType.PLATFORM },
        { provide: TENANT_MIGRATIONS, useValue: migrations },
        { provide: PLATFORM_CONNECTION_NAME, useValue: { value: undefined } },
        { provide: IS_SANDBOX, useValue: false },
        TenantService,
      ],
      exports: [TenantService, APP_TYPE, PLATFORM_CONNECTION_NAME, IS_SANDBOX],
      imports: [TypeOrmModule.forFeature([TenantEntity])],
    };
  }
  /** Registers the app type as TENANT and initializes the domain/tenant cache*/
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static forTenantRoot(cacheStoreconfig: CacheManagerOptions & Record<any, any> = {}, isSandbox: boolean) {
    setCurrentAppType(AppType.TENANT);
    return {
      global: true,
      module: MultiTenantApiModule,
      controllers: [TenantInfoController],
      providers: [
        { provide: APP_TYPE, useValue: AppType.TENANT },
        TenantCacheService,
        { provide: PLATFORM_CONNECTION_NAME, useValue: { value: MultiTenancyConstants.PLATFORM_DB_CONNECTION_NAME } },
        { provide: IS_SANDBOX, useValue: isSandbox },
        {
          provide: APP_GUARD,
          useFactory: () => {
            return new TenantGuard();
          },
        },
      ],
      exports: [APP_TYPE, TenantCacheService, PLATFORM_CONNECTION_NAME, IS_SANDBOX],
      imports: [
        CacheModule.register({ ...cacheStoreconfig, isGlobal: false }),
        TypeOrmModule.forFeature([TenantEntity], MultiTenancyConstants.PLATFORM_DB_CONNECTION_NAME),
      ],
    };
  }
  /** Registers the app type as BASIC*/
  static forBasicRoot() {
    setCurrentAppType(AppType.BASIC);
    return {
      global: true,
      module: MultiTenantApiModule,
      providers: [
        { provide: APP_TYPE, useValue: AppType.BASIC },
        { provide: PLATFORM_CONNECTION_NAME, useValue: { value: undefined } },
        { provide: IS_SANDBOX, useValue: false },
      ],
      exports: [APP_TYPE, PLATFORM_CONNECTION_NAME, IS_SANDBOX],
    };
  }
}

export function getMultiTenancyImports(config: MultiTenancyApiConfig) {
  switch (config.type) {
    case AppType.PLATFORM:
      return [
        TypeOrmModule.forRoot(config.platform_connection),
        TypeOrmModule.forRoot({
          ...(config as MultiTenancyPlatformApiConfig).default_tenant_connection,
          name: MultiTenancyConstants.TENANT_CONNECTION_NAME,
        }),
        MultiTenantApiModule.forPlatformRoot((config as MultiTenancyPlatformApiConfig).migrations),
      ];
    case AppType.TENANT:
      return [
        TypeOrmModule.forRoot({
          ...config.platform_connection,
          name: MultiTenancyConstants.PLATFORM_DB_CONNECTION_NAME,
        }),
        TypeOrmModule.forRoot((config as MultiTenancyTenantApiConfig).default_tenant_connection),
        MultiTenantApiModule.forTenantRoot(
          (config as MultiTenancyTenantApiConfig).cacheStoreconfig,
          (config as MultiTenancyTenantApiConfig).isSandbox
        ),
      ];
    default:
      return [TypeOrmModule.forRoot(config.platform_connection), MultiTenantApiModule.forBasicRoot()];
  }
}
