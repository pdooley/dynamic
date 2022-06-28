import { ApiProperty } from '@nestjs/swagger';
import { MailSent } from '@vsolv/common/email/domain';
import { VsolvEntity } from '@vsolv/dev-kit/nest';
import { IsDate, IsString } from 'class-validator';
import { BaseEntity, Column, CreateDateColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { MailTemplateEntity } from './mail-template.entity';
@VsolvEntity({ name: 'mail_sent', prefix: 'mail' }, ['platform', 'tenant'])
export class MailSentEntity extends BaseEntity implements MailSent {
  @PrimaryColumn()
  @IsString()
  @ApiProperty()
  id!: string;

  @ManyToOne(() => MailTemplateEntity)
  @ApiProperty({ type: () => MailTemplateEntity })
  template!: MailTemplateEntity;

  @Column()
  @IsString()
  @ApiProperty()
  to!: string;

  @Column()
  @IsString()
  @ApiProperty()
  from!: string;

  @Column()
  @IsString()
  @ApiProperty()
  subject!: string;

  @IsString()
  @ApiProperty()
  @Column({ type: 'longtext' })
  html!: string;

  @IsString()
  @ApiProperty()
  @Column({ type: 'longtext' })
  templateData!: string;

  @CreateDateColumn({ name: 'created_at' })
  @IsDate()
  created!: Date;
}
