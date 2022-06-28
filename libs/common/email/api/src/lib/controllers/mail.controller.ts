import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateMailSendDto } from '@vsolv/common/email/domain';
import { Public } from '@vsolv/core/auth/api';
import { VSolvConnection } from '@vsolv/core/multi-tenant/api';
import { Connection } from 'typeorm';
import { MailSentService } from '../services';

@ApiTags('Mail')
@Controller('mail')
export class MailController {
  constructor(private mail: MailSentService) {}

  @Public()
  @Post()
  @ApiBody({ type: CreateMailSendDto })
  @ApiOperation({ operationId: 'sendEmail', summary: 'Send an email' })
  @ApiOkResponse({ description: 'Returns the success message' })
  async sendMail(@Body() createEmailDto: CreateMailSendDto, @VSolvConnection() connection: Connection) {
    return await this.mail.createMail(createEmailDto, connection);
  }
}
