import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsArray } from 'class-validator';
import { PageMetaDto } from './page-meta.dto';

export class PageDto<T> {
    @IsArray()
    @ApiProperty({ isArray: true })
    readonly items: T[];

    @ApiProperty({ type: () => PageMetaDto })
    @Allow()
    readonly meta: PageMetaDto;

    constructor(items: T[], meta: PageMetaDto) {
        this.items = items;
        this.meta = meta;
    }
}
