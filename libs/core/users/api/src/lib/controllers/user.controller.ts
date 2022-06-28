import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { VSolvAuthInfo } from '@vsolv/core/auth/api';
import { AuthInfo } from '@vsolv/core/auth/domain';
import { VSolvConnection, VSolvTenantId } from '@vsolv/core/multi-tenant/api';
import { PaginationQueryRequest } from '@vsolv/dev-kit/nest';
import { Connection } from 'typeorm';
import { VSolvUserId } from '../decorators';
import { UserService } from '../services';

@Controller('users')
@ApiExcludeController()
export class UserController {
  constructor(private userSvc: UserService) {}

  @Get()
  async getSignedInUser(@VSolvConnection() connection: Connection, @VSolvUserId() userId: string) {
    return userId ? await this.userSvc.getUser(connection, userId) : undefined;
  }

  @Get('paginate')
  async paginateUsers(@VSolvConnection() connection: Connection, @Query() pagination: PaginationQueryRequest) {
    return await this.userSvc.paginateUsers(connection, pagination);
  }

  @Get(':userId')
  async getUser(@VSolvConnection() connection: Connection, @Param('userId') userId: string) {
    return await this.userSvc.getUser(connection, userId);
  }

  @Post()
  async createNewUser(
    @VSolvConnection() connection: Connection,
    @VSolvAuthInfo() authInfo: AuthInfo,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Body() dto: any, //TODO: dto
    @VSolvTenantId() tenantId?: string
  ) {
    return await this.userSvc.createNewUser(connection, authInfo, dto, tenantId);
  }
  @Post('ensure')
  async ensureUser(
    @VSolvConnection() connection: Connection,
    @VSolvAuthInfo() authInfo: AuthInfo,
    @VSolvTenantId() tenantId?: string
  ) {
    return await this.userSvc.ensureUser(connection, authInfo, tenantId);
  }
}
