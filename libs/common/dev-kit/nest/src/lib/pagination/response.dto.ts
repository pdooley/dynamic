import { ApiProperty } from '@nestjs/swagger';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';

export class PaginationMeta implements IPaginationMeta {
  @ApiProperty({ description: 'Count of items on the current page.', minimum: 0 })
  itemCount!: number;

  @ApiProperty({ description: 'Total number of items (all pages included).', minimum: 0, required: false })
  totalItems?: number;

  @ApiProperty({ description: 'Number of items per page.', minimum: 1 })
  itemsPerPage!: number;

  @ApiProperty({ description: 'Total number of pages.', minimum: 0, required: false })
  totalPages?: number;

  @ApiProperty({ description: 'Current page number.', minimum: 1 })
  currentPage!: number;
}

export abstract class PaginationQueryResponse<T> implements Pagination<T> {
  abstract items: T[];

  @ApiProperty({ type: PaginationMeta })
  meta!: PaginationMeta;
}
