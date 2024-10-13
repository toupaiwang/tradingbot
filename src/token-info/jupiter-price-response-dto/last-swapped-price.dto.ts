import { IsNumber, IsString } from 'class-validator';

export class LastSwappedPriceDto {
  @IsNumber()
  lastJupiterSellAt: number;

  @IsString()
  lastJupiterSellPrice: string;

  @IsNumber()
  lastJupiterBuyAt: number;

  @IsString()
  lastJupiterBuyPrice: string;
}
