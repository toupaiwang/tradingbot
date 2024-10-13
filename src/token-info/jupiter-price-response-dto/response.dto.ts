import { IsNumber, IsObject } from 'class-validator';
import { DataItemDto } from './data-item.dto';

export class ResponseDto {
  @IsObject()
  data: {
    [key: string]: DataItemDto;
  };

  @IsNumber()
  timeTaken: number;
}
