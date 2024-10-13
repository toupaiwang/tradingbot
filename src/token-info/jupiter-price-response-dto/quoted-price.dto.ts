import { IsNumber, IsOptional, IsString } from 'class-validator';

export class QuotedPriceDto {
  @IsString()
  buyPrice: string;

  @IsNumber()
  buyAt: number;

  @IsOptional()
  @IsString()
  sellPrice?: string;

  @IsOptional()
  @IsNumber()
  sellAt?: number;
}
