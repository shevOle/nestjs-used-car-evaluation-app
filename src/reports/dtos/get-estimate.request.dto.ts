import {
  IsString,
  IsNumber,
  IsLatitude,
  IsLongitude,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class GetEstimateRequestDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1900)
  @Max(2100)
  year: number;

  @Transform(({ value }) => parseFloat(value))
  @IsLongitude()
  lng: number;

  @Transform(({ value }) => parseFloat(value))
  @IsLatitude()
  lat: number;
}
