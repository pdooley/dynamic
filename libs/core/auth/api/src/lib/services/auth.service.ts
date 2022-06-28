import { Inject, Injectable } from '@nestjs/common';

import { AUTH_HANDLER } from '../symbols';
import { AuthHandlerService } from './auth-handler.service';

@Injectable()
export class AuthService {
  constructor(@Inject(AUTH_HANDLER) private authHandlerSvc: AuthHandlerService) {}

  async register(email: string, password: string, info?: { displayName?: string; phoneNumber?: string }) {
    return await this.authHandlerSvc.register(email, password, info);
  }
}
