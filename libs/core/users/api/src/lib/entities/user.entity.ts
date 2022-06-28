import { ApiProperty } from '@nestjs/swagger';
import { User } from '@vsolv/core/users/domain';
import { AddressEmbeddedEntity, VsolvEntity } from '@vsolv/dev-kit/nest';
import { BaseEntity, Column, CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@VsolvEntity({ name: 'user', prefix: 'usr' }, ['platform', 'tenant'])
export class UserEntity extends BaseEntity implements User {
  @PrimaryColumn()
  @ApiProperty({ example: 'usr_123' })
  id!: string;

  @Column('boolean', { default: false })
  isSuperAdmin!: boolean;

  @CreateDateColumn()
  @ApiProperty({ example: new Date() })
  created!: Date;

  @UpdateDateColumn()
  @ApiProperty({ example: new Date() })
  modified!: Date;

  @Column({ nullable: true })
  @ApiProperty({ example: 'address@domain.com', nullable: true })
  email?: string;

  @Column({ default: false })
  @ApiProperty({ example: true, default: false })
  emailVerified!: boolean;

  @Column({ nullable: true, default: null })
  @ApiProperty({ example: '123-123-1234', nullable: true, default: null })
  phoneNumber?: string;

  @Column({ nullable: true, default: null })
  @ApiProperty({ example: 'John Doe', nullable: true })
  displayName?: string;

  @Column({ nullable: true, default: null })
  @ApiProperty({ example: 'John', nullable: true, default: null })
  friendlyName?: string;

  @Column({ nullable: true, default: null })
  @ApiProperty({ example: 'https://...', nullable: true, default: null })
  photoURL?: string;

  @Column(() => AddressEmbeddedEntity)
  @ApiProperty({ type: AddressEmbeddedEntity, nullable: true, default: null })
  address?: AddressEmbeddedEntity;

  @Column({ nullable: true, default: null })
  @ApiProperty({ example: 'new Date()', nullable: true, default: null })
  birthday?: Date;
}
