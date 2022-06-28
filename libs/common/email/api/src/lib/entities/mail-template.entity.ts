import { MailTemplate } from '@vsolv/common/email/domain';
import { VsolvEntity } from '@vsolv/dev-kit/nest';
import { BaseEntity, Column, PrimaryColumn } from 'typeorm';

@VsolvEntity({ name: 'mail_template' }, ['platform', 'tenant'])
export class MailTemplateEntity extends BaseEntity implements MailTemplate {
  @PrimaryColumn()
  id!: string;
  @Column({ name: 'html_template', nullable: false, type: 'longtext' })
  htmlTemplateString!: string;
}
