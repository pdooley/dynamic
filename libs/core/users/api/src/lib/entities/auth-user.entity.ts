import { ApiProperty } from '@nestjs/swagger';
import { AuthUser } from '@vsolv/core/auth/domain';
import { BaseVsolvEntity } from '@vsolv/dev-kit/nest';
import { Column, PrimaryColumn } from 'typeorm';

@BaseVsolvEntity({ name: 'auth_user' }, 'platform')
export class AuthUserEntity implements AuthUser {
  @PrimaryColumn()
  authId!: string;

  @PrimaryColumn()
  @ApiProperty({ example: 'usr_123' })
  userId!: string;

  @Column({ nullable: true })
  @ApiProperty({ example: 'tnt_123' })
  tenantId?: string;

  @Column()
  @ApiProperty({ example: false })
  default!: boolean;
}
