import { Module, Type } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './controllers';
import { VSolvAuthGuard } from './guards/auth.guard';
import { AuthHandlerService, AuthService } from './services';
import { AUTH_HANDLER } from './symbols';

@Module({
  controllers: [],
  providers: [],
  exports: [],
  imports: [],
})
export class AuthApiModule {
  /** Provides the auth guard with the given authorization strategy(ies) (e.g. Firebase) */
  static forRoot(strategy: string | string[], handler: Type<AuthHandlerService>) {
    return {
      global: true,
      module: AuthApiModule,
      imports: [PassportModule],
      controllers: [AuthController],
      providers: [
        {
          provide: AUTH_HANDLER,
          useClass: handler,
        },
        AuthService,
        {
          provide: APP_GUARD,
          useFactory: (reflector: Reflector) => {
            return new (VSolvAuthGuard(strategy))(reflector);
          },
          inject: [Reflector],
        },
      ],
    };
  }
}
