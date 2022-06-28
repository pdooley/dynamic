import { MiddlewareConsumer, Module, Type } from '@nestjs/common';
import { AuthApiModule, AuthHandlerService } from '@vsolv/core/auth/api';
import { DowntimeApiModule } from '@vsolv/core/downtime/api';
import {
  AppTypeMiddleware,
  getMultiTenancyImports,
  MultiTenancyApiConfig,
  TenantIdMiddleware,
} from '@vsolv/core/multi-tenant/api';
import { AppType, MultiTenancyConstants } from '@vsolv/core/multi-tenant/domain';
import { UsersApiModule } from '@vsolv/core/users/api';

@Module({
  controllers: [],
  providers: [],
  exports: [],
  imports: [],
})
export class VsolvCoreApiModule {
  private static appType: AppType | null = null;
  static forRoot(
    authStrategy: string,
    authHandler: Type<AuthHandlerService>,
    multiTenancyConfig: MultiTenancyApiConfig
  ) {
    this.appType = multiTenancyConfig.type;
    return {
      module: VsolvCoreApiModule,
      controllers: [],
      exports: [],
      providers: [],
      imports: [
        AuthApiModule.forRoot(authStrategy, authHandler),
        ...getMultiTenancyImports(multiTenancyConfig),
        DowntimeApiModule.forRoot(
          multiTenancyConfig.type === AppType.TENANT ? MultiTenancyConstants.PLATFORM_DB_CONNECTION_NAME : undefined
        ),
        UsersApiModule.forRoot(
          multiTenancyConfig.type === AppType.TENANT ? MultiTenancyConstants.PLATFORM_DB_CONNECTION_NAME : undefined
        ),
        //other core modules
      ],
    };
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(/*DowntimeMiddleware,*/ AppTypeMiddleware).forRoutes('*');
    if (VsolvCoreApiModule.appType === AppType.TENANT) consumer.apply(TenantIdMiddleware).forRoutes('*');
  }
}
