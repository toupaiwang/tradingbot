import { IsObject, IsNumber, IsOptional } from 'class-validator';
import { DepthDto } from './depth.dto';

export class BuyPriceImpactRatioDto {
  @IsObject()
  depth: DepthDto;

  @IsNumber()
  timestamp: number;
}

export class SellPriceImpactRatioDto {
  @IsObject()
  depth: DepthDto;

  @IsOptional()
  @IsNumber()
  timestamp?: number;
}
