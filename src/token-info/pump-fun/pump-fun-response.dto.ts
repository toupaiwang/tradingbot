import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PumpFunResponseDto {
  @IsString()
  mint: string;

  @IsString()
  name: string;

  @IsString()
  symbol: string;

  @IsString()
  description: string;

  @IsUrl()
  image_uri: string;

  @IsUrl()
  metadata_uri: string;

  @IsUrl()
  twitter: string;

  @IsUrl()
  telegram: string;

  @IsString()
  bonding_curve: string;

  @IsString()
  associated_bonding_curve: string;

  @IsString()
  creator: string;

  @Type(() => Number)
  @IsNumber()
  created_timestamp: number;

  @IsString()
  raydium_pool: string;

  @IsBoolean()
  complete: boolean;

  @Type(() => Number)
  @IsNumber()
  virtual_sol_reserves: number;

  @Type(() => Number)
  @IsNumber()
  virtual_token_reserves: number;

  @Type(() => Number)
  @IsNumber()
  total_supply: number;

  @IsUrl()
  website: string;

  @IsBoolean()
  show_name: boolean;

  @Type(() => Number)
  @IsNumber()
  king_of_the_hill_timestamp: number;

  @Type(() => Number)
  @IsNumber()
  market_cap: number;

  @Type(() => Number)
  @IsNumber()
  reply_count: number;

  @Type(() => Number)
  @IsNumber()
  last_reply: number;

  @IsBoolean()
  nsfw: boolean;

  @IsString()
  market_id: string;

  @IsBoolean()
  inverted: boolean;

  @IsBoolean()
  is_currently_live: boolean;

  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  profile_image: string | null;

  @Type(() => Number)
  @IsNumber()
  usd_market_cap: number;
}
