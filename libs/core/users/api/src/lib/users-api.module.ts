import { Module } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthApiModule } from '@vsolv/core/auth/api';
import { MultiTenantApiModule } from '@vsolv/core/multi-tenant/api';
import { AuthUserController, UserController } from './controllers';
import { AuthUserEntity, UserEntity } from './entities';
import { UserGuard } from './guards';
import { AuthUserService, UserService } from './services';

@Module({
  controllers: [UserController, AuthUserController],
  providers: [UserService, AuthUserService],
  exports: [UserService, AuthUserService],
  imports: [PassportModule, AuthApiModule, MultiTenantApiModule, TypeOrmModule.forFeature([UserEntity])],
})
export class UsersApiModule {
  static forRoot(platformConnectionName?: string) {
    return {
      global: true,
      module: UsersApiModule,
      imports: [PassportModule, TypeOrmModule.forFeature([AuthUserEntity], platformConnectionName)],
      providers: [
        {
          provide: APP_GUARD,
          useFactory: (userAuthSvc: AuthUserService, reflector: Reflector) => {
            return new UserGuard(userAuthSvc, reflector);
          },
          inject: [AuthUserService, Reflector],
        },
      ],
    };
  }
}
