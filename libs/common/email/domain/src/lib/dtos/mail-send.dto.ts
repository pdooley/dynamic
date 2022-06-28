import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ICSGeneratorConfig } from '../models';
// import type { ICSGeneratorConfig } from './ics-generator';

export class CreateMailSendDto {
  constructor(dto?: CreateMailSendDto) {
    if (dto) Object.assign(this, dto);
  }

  @IsString()
  @IsNotEmpty()
  templateId!: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  templateData: any;

  @IsEmail()
  to!: string;

  @IsString()
  @IsNotEmpty()
  subject!: string;

  @IsString()
  @IsOptional()
  from?: string;

  @IsString()
  @IsOptional()
  replyTo?: string;

  @IsString()
  @IsOptional()
  attachmentName?: string;

  @IsString()
  @IsOptional()
  attachmentContent?: string;

  @IsOptional()
  icsData?: ICSGeneratorConfig;

  @IsString()
  application!: string;
}
