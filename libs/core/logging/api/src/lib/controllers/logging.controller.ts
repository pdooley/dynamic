import { Controller, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiHeaders, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MultiTenancyConstants } from '@vsolv/core/multi-tenant/domain';
import { PinoLogger } from 'nestjs-pino';

@ApiTags('Logging')
@Controller('logger')
export class LoggingController {
  //TODO: hide endpoint for dev
  constructor(private readonly logger: PinoLogger) {}

  @Post(':level')
  @ApiOperation({ summary: 'Change log level' })
  @ApiHeaders([
    {
      name: MultiTenancyConstants.TENANT_ID_HEADER_KEY,
      required: false,
      example: 'tnt_123',
      description: 'The tenant id for the tenant api. Does not work with the platform api',
    },
  ])
  async updateLoggingLevel(@Param('level') level: string) {
    // eslint-disable-next-line no-prototype-builtins
    if (PinoLogger.root.levels.values.hasOwnProperty(level)) {
      PinoLogger.root.level = level;
      this.logger.info('Log level changed to ' + level);
      return 'Log level changed to ' + level;
    }
    throw new HttpException('Log level cannot be changed to ' + level, HttpStatus.BAD_REQUEST);
  }
}
