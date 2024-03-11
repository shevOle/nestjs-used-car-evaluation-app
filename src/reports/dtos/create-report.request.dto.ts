import {
  IsString,
  IsNumber,
  IsLatitude,
  IsLongitude,
  Min,
  Max,
} from 'class-validator';

export class CreateReportRequestDto {
  @IsNumber()
  @Min(0)
  @Max(1000000)
  price: number;

  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;

  @IsNumber()
  @Min(1990)
  @Max(2030)
  year: number;

  @IsLongitude()
  lng: number;

  @IsLatitude()
  lat: number;
}
