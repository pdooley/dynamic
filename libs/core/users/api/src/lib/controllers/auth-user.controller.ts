import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { VSolvAuthInfo } from '@vsolv/core/auth/api';
import { AuthInfo } from '@vsolv/core/auth/domain';
import { VSolvConnection, VSolvTenantId } from '@vsolv/core/multi-tenant/api';
import { PaginationQueryRequest } from '@vsolv/dev-kit/nest';
import { Connection } from 'typeorm';
import { AuthUserService } from '../services';

@ApiExcludeController()
@Controller('auth-user')
export class AuthUserController {
  constructor(private userSvc: AuthUserService) {}
  @Get()
  async getUsersForAuth(
    @VSolvConnection() connection: Connection,
    @VSolvAuthInfo() authInfo: AuthInfo,
    @VSolvTenantId() tenantId?: string
  ) {
    return await this.userSvc.getUsersForAuth(connection, authInfo, tenantId);
  }

  @Get('paginate')
  async paginate(@Query() pagination: PaginationQueryRequest) {
    return await this.userSvc.paginateAuthUsers(pagination);
  }

  @Get(':userId')
  async getOne(
    @VSolvAuthInfo() authInfo: AuthInfo,
    @Param('userId') userId: string,
    @VSolvTenantId() tenantId?: string
  ) {
    return await this.userSvc.getOneByUser(authInfo.id, userId, tenantId);
  }
}
