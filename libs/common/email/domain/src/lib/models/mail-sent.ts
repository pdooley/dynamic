import { MailTemplate } from './mail-template';

export interface MailSent {
  id: string;
  template: MailTemplate;

  templateData: string;
  to: string;
  subject: string;
  created: Date;

  from: string;
  html: string;
}
