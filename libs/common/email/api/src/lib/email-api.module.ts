import { MailerModule } from '@nestjs-modules/mailer';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ICSGenerator } from '@vsolv/common/email/domain';
import Handlebars from 'handlebars';
import moment from 'moment-timezone';
//import { ICSGenerator } from '@vsolv/common/email/domain';
import { MailController } from './controllers';
import { MailSentEntity, MailTemplateEntity } from './entities';
import { MailSentService, MailTemplateService, SES_CONFIGURATION_SET } from './services';

@Module({
  providers: [MailSentService, MailTemplateService, ICSGenerator],
  controllers: [MailController],
  exports: [MailSentService, MailTemplateService, ICSGenerator],
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (/*config: ConfigService*/) => ({
        transport: {
          host: 'email-smtp.us-east-1.amazonaws.com',
          port: '465',
          secure: true,
          requireTLS: true,
          auth: {
            user: 'AKIA2Z36LQKIKWPJQSN7',
            pass: 'BOE7BPQwp33NAvKiYBUwKDnIRR29DbnjyNGfDDdSLce6',
          },
        },
        defaults: {
          from: {
            name: 'homegauge',
            address: 'clemieux@vectorsolv.com',
          },
        },
      }),
      // inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([MailTemplateEntity, MailSentEntity]),
    ICSGenerator,
  ],
})
export class EmailApiModule {
  static forRoot(SESConfigurationSet: string): DynamicModule {
    Handlebars.registerHelper({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatDate: (date: any, format: string) => moment.utc(date).tz('America/Toronto').format(format),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatCurrency: (value: any) => {
        const dollarValueFormat = Math.abs(Number(value) / 100).toFixed(2);
        return (value < 0 ? '-' : '') + '$' + dollarValueFormat;
      },
    });

    const sesConfigurationProvider: Provider = { provide: SES_CONFIGURATION_SET, useValue: SESConfigurationSet };
    return {
      module: EmailApiModule,
      providers: [sesConfigurationProvider],
    };
  }
}
