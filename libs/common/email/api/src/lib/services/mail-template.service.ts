import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { MailTemplateEntity } from '../entities';

@Injectable()
export class MailTemplateService {
  async getOne(id: string, connection: Connection) {
    const template = await connection.getRepository(MailTemplateEntity).findOne({
      where: { id },
    });
    return template;
  }
}
