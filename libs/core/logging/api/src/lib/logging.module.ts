import { Module } from '@nestjs/common';
import { LoggingController } from './controllers';
import { LoggingInterceptor } from './interceptors';

@Module({
  controllers: [LoggingController],
  providers: [LoggingInterceptor],
  exports: [],
})
export class CoreLoggingApiModule {}
