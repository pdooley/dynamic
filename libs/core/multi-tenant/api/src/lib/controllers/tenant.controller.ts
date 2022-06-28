import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiExcludeController, ApiOperation } from '@nestjs/swagger';
import { Public } from '@vsolv/core/auth/api';
import { PaginationQueryRequest } from '@vsolv/dev-kit/nest';
import { TenantService } from '../services/tenant.service';

/** This is a platform-side controller used to manage and update tenants*/
@Controller('tenants')
@ApiExcludeController()
export class TenantController {
  constructor(private tenantSvc: TenantService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tenants' })
  async getAll() {
    return await this.tenantSvc.getAll();
  }
  @Get('paginate')
  async paginate(@Query() pagination: PaginationQueryRequest) {
    return await this.tenantSvc.paginate(pagination);
  }

  @Get(':id')
  @Public()
  async getOne(@Param('id') id: string) {
    return await this.tenantSvc.getOne(id);
  }

  @Post()
  async create(@Body() body: { name: string }) {
    return await this.tenantSvc.create(body.name);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: { name: string }) {
    return await this.tenantSvc.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.tenantSvc.delete(id);
  }
}
