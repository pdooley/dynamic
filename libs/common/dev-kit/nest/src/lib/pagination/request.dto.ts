import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationQueryRequest {
  @Min(1)
  @IsInt()
  @Max(100)
  @IsOptional()
  @ApiProperty({ type: 'integer', example: 10, default: 10 })
  limit = 10;

  @Min(1)
  @IsInt()
  @IsOptional()
  @ApiProperty({ type: 'integer', example: 1, default: 1 })
  page = 1;
}
