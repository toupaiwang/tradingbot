import { IsObject, IsString } from 'class-validator';
import { LastSwappedPriceDto } from './last-swapped-price.dto';
import { QuotedPriceDto } from './quoted-price.dto';
import { BuyPriceImpactRatioDto, SellPriceImpactRatioDto } from './price-impact-ratio.dto';

export class ExtraInfoDto {
  @IsObject()
  lastSwappedPrice: LastSwappedPriceDto;

  @IsObject()
  quotedPrice: QuotedPriceDto;

  @IsString()
  confidenceLevel: string;

  @IsObject()
  depth: {
    buyPriceImpactRatio: BuyPriceImpactRatioDto;
    sellPriceImpactRatio: SellPriceImpactRatioDto;
  };
}
