import { IsNumber, IsOptional } from 'class-validator';

export class DepthDto {
  @IsOptional()
  @IsNumber()
  '10'?: number;

  @IsOptional()
  @IsNumber()
  '100'?: number;

  @IsOptional()
  @IsNumber()
  '1000'?: number;
}
