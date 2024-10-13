import { IsString, IsObject } from 'class-validator';
import { ExtraInfoDto } from './extra-info.dto';

export class DataItemDto {
  @IsString()
  id: string;

  @IsString()
  type: string;

  @IsString()
  price: string;

  @IsObject()
  extraInfo: ExtraInfoDto;
}
