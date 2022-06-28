import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable, Optional } from '@nestjs/common';
import { CreateMailSendDto } from '@vsolv/common/email/domain';
import { compile } from 'handlebars';
import inlineBase64 from 'nodemailer-plugin-inline-base64';
import { Connection } from 'typeorm';
import { MailSentEntity } from '../entities';
import { MailTemplateService } from './mail-template.service';
import { SES_CONFIGURATION_SET } from './ses-configuration';
@Injectable()
export class MailSentService {
  email = 'clemieux@vectorsolv.com';
  applicationName = 'warrantysphere';

  constructor(
    private mailerService: MailerService,
    private templateService: MailTemplateService,
    // private icsGenerator: ICSGenerator,

    @Optional() @Inject(SES_CONFIGURATION_SET) private SESConfigurationSet: string
  ) {
    this.mailerService['transporter'].use('compile', inlineBase64({ cidPrefix: 'warrantysphere_' }));
  }

  async createMail(dto: CreateMailSendDto, connection: Connection) {
    // TODO: once warrantysphere info decide ,replace here
    // if (dto.application == 'altea') {
    //   dto.templateData.activity['platformData'] = alteaInfo;
    // } else {
    //   dto.templateData.activity['platformData'] = lf3Info;
    // }

    const existingTemplate = await this.templateService.getOne(dto.templateId, connection);
    if (!existingTemplate) return; //throw new BadRequestException(); //Hi, Zac here. This was throwing me an error whenever I updated/cancelled a booking with a zoom resource.

    //  const icsFile = dto.icsData ? this.icsGenerator.generateIcsString(dto.icsData) : null;

    const html = compile(existingTemplate.htmlTemplateString)(dto?.templateData);

    await connection.transaction(async manager => {
      const mail = await manager.save(
        manager.create(MailSentEntity, {
          template: { id: dto.templateId },
          to: dto.to,
          subject: dto.subject,
          templateData: JSON.stringify(dto?.templateData),
          from: this.email,
          html: '',
        })
      );
      // TODO: uncomment after the email service config
      await this.mailerService.sendMail({
        to: dto.to,
        subject: dto.subject,
        replyTo: dto.replyTo ? dto.replyTo : '',
        from: {
          name: this.applicationName,
          address: this.email,
        },
        html: html,
        headers: {
          'X-SES-CONFIGURATION-SET': this.SESConfigurationSet,
          'X-SES-MESSAGE-TAGS': 'mailId=' + '1212121',
        },
      });
      return mail;
    });
  }
}
