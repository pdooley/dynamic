import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Public } from '@vsolv/core/auth/api';
import { DowntimeService } from '../services';

@Controller('downtime')
@ApiExcludeController()
export class DowntimeController {
  constructor(private downtimeSvc: DowntimeService) {}

  @Get()
  @Public()
  async getDowntimeStatus() {
    return await this.downtimeSvc.getDowntimeStatus();
  }

  @Post()
  async createDowntime() {
    return await this.downtimeSvc.createDowntime();
  }

  @Patch()
  async completeDowntime(@Body() id: number) {
    return await this.downtimeSvc.completeDowntime(id);
  }
}
