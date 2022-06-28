import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { LoggerOptions } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

class ExtraConnectionOptions {
  @IsString()
  @IsOptional()
  socketPath?: string;
}

class CliConnectionOptions {
  @IsString()
  @IsOptional()
  migrationsDir?: string;
}

export class ApiDatabaseEnvironment implements MysqlConnectionOptions {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsIn(['mysql'])
  @IsNotEmpty()
  type!: 'mysql';
  @IsNumber()
  port!: number;

  @IsString()
  @IsNotEmpty()
  host!: string;

  @IsString()
  @IsNotEmpty()
  database!: string;

  @IsBoolean()
  @IsDefined()
  autoLoadEntities!: boolean;

  @IsBoolean()
  @IsOptional()
  synchronize?: boolean;

  @IsOptional()
  logging?: LoggerOptions;

  @IsOptional()
  @ValidateNested()
  @Type(() => ExtraConnectionOptions)
  extra?: ExtraConnectionOptions;

  @IsString()
  @IsOptional()
  migrationsTableName?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  migrations?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CliConnectionOptions)
  cli?: CliConnectionOptions;
}
