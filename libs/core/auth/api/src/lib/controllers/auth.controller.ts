import { Body, Controller, Post } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

import { Public } from '../decorators';
import { AuthService } from '../services';

@Controller('auth')
@ApiExcludeController()
export class AuthController {
  constructor(private authSvc: AuthService) {}

  @Post('register')
  @Public()
  async register(
    @Body() dto: { email: string; password: string; info?: { displayName?: string; phoneNumber?: string } }
  ) {
    return await this.authSvc.register(dto.email, dto.password, dto.info);
  }
}
