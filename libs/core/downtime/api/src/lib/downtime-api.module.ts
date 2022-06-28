import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthApiModule } from '@vsolv/core/auth/api';
import { MultiTenantApiModule } from '@vsolv/core/multi-tenant/api';
import { DowntimeController } from './controllers';
import { DowntimeEntity } from './entities';
import { DowntimeGuard } from './guards';
import { DowntimeService } from './services';

@Module({
  controllers: [DowntimeController],
  providers: [DowntimeService],
  exports: [DowntimeService],
  imports: [PassportModule, AuthApiModule, MultiTenantApiModule],
})
export class DowntimeApiModule {
  static forRoot(platformConnectionName?: string) {
    return {
      global: true,
      module: DowntimeApiModule,
      imports: [TypeOrmModule.forFeature([DowntimeEntity], platformConnectionName)],
      providers: [
        {
          provide: APP_GUARD,
          useFactory: (downtimeSvc: DowntimeService) => {
            return new DowntimeGuard(downtimeSvc);
          },
          inject: [DowntimeService],
        },
      ],
    };
  }
}
