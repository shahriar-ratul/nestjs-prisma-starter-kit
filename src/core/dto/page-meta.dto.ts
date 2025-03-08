import { ApiProperty } from '@nestjs/swagger';
import type { PageMetaDtoParameters } from './../interfaces/page-meta-dto-parameters.interface';

export class PageMetaDto {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly limit: number;

  @ApiProperty()
  readonly total: number;

  @ApiProperty()
  readonly pageCount: number;

  @ApiProperty()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, total }: PageMetaDtoParameters) {
    this.page = Number(pageOptionsDto.page);
    this.limit = Number(pageOptionsDto.limit);
    this.total = total;
    this.pageCount = Math.ceil(this.total / this.limit);
    this.hasPreviousPage = Number(pageOptionsDto.page) > 1;
    this.hasNextPage = Number(pageOptionsDto.page) < Math.ceil(this.total / this.limit);
  }
}
