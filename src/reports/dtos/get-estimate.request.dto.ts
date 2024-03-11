import {
  IsString,
  IsNumber,
  IsLatitude,
  IsLongitude,
  Min,
  Max,
  IsDefined,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class GetEstimateRequestDto {
  @IsString({ message: 'Maker must be a string' })
  @IsDefined({ message: 'Maker is obligatory' })
  make: string;

  @IsString({ message: 'Model must be a string' })
  @IsDefined({ message: 'Model is obligatory' })
  model: string;

  @Transform(({ value }) => parseInt(value))
  @IsDefined({ message: 'Mileage is obligatory' })
  @IsNumber({ allowNaN: false })
  @Min(0, { message: 'Mileage should be a positive number up to 1000000' })
  @Max(1000000, {
    message: 'Mileage should be a positive number up to 1000000',
  })
  mileage: number;

  @Transform(({ value }) => parseInt(value))
  @IsDefined({ message: 'Year is obligatory' })
  @IsNumber({ allowNaN: false })
  @Min(1990, { message: 'Year value must be from 1990 to 2030' })
  @Max(2030, { message: 'Year value must be from 1990 to 2030' })
  year: number;

  @Transform(({ value }) => parseFloat(value))
  @IsDefined({ message: 'Longitude is obligatory' })
  @IsLongitude({ message: 'Longitude must be a number between -180 and 180' })
  lng: number;

  @Transform(({ value }) => parseFloat(value))
  @IsDefined({ message: 'Latitude is obligatory' })
  @IsLatitude({ message: 'Latitude must be a number between -90 and 90' })
  lat: number;
}
