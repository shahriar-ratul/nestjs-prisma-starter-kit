import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Order } from '../constants/order.constant';

export class PageOptionsDto {
    @ApiPropertyOptional({ enum: Order, enumName: 'Order', default: Order.ASC })
    @IsEnum(Order)
    @IsOptional()
    readonly order?: Order = Order.DESC;

    @ApiPropertyOptional({
        minimum: 1,
        default: 1,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    readonly page?: number = 1;

    @ApiPropertyOptional({
        minimum: 1,
        maximum: 50,
        default: 10,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    @IsOptional()
    readonly limit?: number = 10;

    @ApiPropertyOptional()
    @IsOptional()
    readonly search?: string;

    @ApiPropertyOptional()
    @IsOptional()
    readonly sort?: string;

    @ApiPropertyOptional()
    @IsOptional()
    readonly type?: string;

    @ApiPropertyOptional()
    @IsOptional()
    readonly min?: string;

    @ApiPropertyOptional()
    @IsOptional()
    readonly max?: string;

    @ApiPropertyOptional()
    @IsOptional()
    readonly category?: string;

    @ApiPropertyOptional()
    @IsOptional()
    readonly adminId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    readonly gradingType?: string;

    @ApiPropertyOptional()
    @IsOptional()
    readonly status?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => (value === 'null' ? undefined : value))
    readonly isActive?: string;

    get skip(): number {
        return ((this.page ?? 1) - 1) * (this.limit ?? 10);
    }
}
