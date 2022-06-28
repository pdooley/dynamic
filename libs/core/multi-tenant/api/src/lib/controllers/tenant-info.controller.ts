import { BadRequestException, Controller, Get, NotFoundException } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiExcludeController,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Public } from '@vsolv/core/auth/api';
import { VSolvTenantId } from '../decorators';
import { TenantCacheService } from '../services';

/**This is a tenant-side controller used to get the up to date tenant information for the front end */
@Controller('tenant')
@ApiExcludeController()
export class TenantInfoController {
  constructor(private tenantCacheSvc: TenantCacheService) {}

  /** Gets the public info of the requested tenant*/
  @Get()
  @Public()
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'My Tenant',
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Unable to find tenant' })
  @ApiBadRequestResponse({ description: 'Unable to retrieve tenant ID from request' })
  @ApiOperation({ summary: 'Tenant Info' })
  async get(@VSolvTenantId() tenantId: string) {
    if (!tenantId) throw new BadRequestException('Unable to retrieve tenant ID from request');

    const info = await this.tenantCacheSvc.getTenantInfo(tenantId);
    if (!info) throw new NotFoundException(`Unable to find tenant ${tenantId}`);

    return info;
  }
}
