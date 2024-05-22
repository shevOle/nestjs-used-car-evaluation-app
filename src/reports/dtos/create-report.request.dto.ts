import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsLatitude,
  IsLongitude,
  Min,
  Max,
  IsDefined,
} from 'class-validator';

export class CreateReportRequestDto {
  @ApiProperty({
    description: 'How much the car was sold for',
    minimum: 0,
    maximum: 1000000,
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber({ allowNaN: false })
  @Min(0, { message: 'Price should be a positive number up to 1000000' })
  @Max(1000000, { message: 'Price should be a positive number up to 1000000' })
  price: number;

  @ApiProperty({
    description: 'What company made the car',
  })
  @IsString({ message: 'Maker must be a string' })
  @IsDefined({ message: 'Maker is obligatory' })
  make: string;

  @ApiProperty({
    description: 'What is the model of the car',
  })
  @IsString({ message: 'Model must be a string' })
  @IsDefined({ message: 'Model is obligatory' })
  model: string;

  @ApiProperty({
    description: 'How much did the car have mileage on',
    minimum: 0,
    maximum: 1000000,
  })
  @Transform(({ value }) => parseInt(value))
  @IsDefined({ message: 'Mileage is obligatory' })
  @IsNumber({ allowNaN: false })
  @Min(0, { message: 'Mileage should be a positive number up to 1000000' })
  @Max(1000000, {
    message: 'Mileage should be a positive number up to 1000000',
  })
  mileage: number;

  @ApiProperty({
    description: 'What year the car was made in',
    minimum: 1990,
    maximum: 2030,
  })
  @Transform(({ value }) => parseInt(value))
  @IsDefined({ message: 'Year is obligatory' })
  @IsNumber({ allowNaN: false })
  @Min(1990, { message: 'Year value must be from 1990 to 2030' })
  @Max(2030, { message: 'Year value must be from 1990 to 2030' })
  year: number;

  @ApiProperty({
    description: 'Where was the car sold (longitude)',
    minimum: -180,
    maximum: 180,
  })
  @Transform(({ value }) => parseFloat(value))
  @IsDefined({ message: 'Longitude is obligatory' })
  @IsLongitude({ message: 'Longitude must be a number between -180 and 180' })
  lng: number;

  @ApiProperty({
    description: 'Where was the car sold (latitude)',
    minimum: -90,
    maximum: 90,
  })
  @Transform(({ value }) => parseFloat(value))
  @IsDefined({ message: 'Latitude is obligatory' })
  @IsLatitude({ message: 'Latitude must be a number between -90 and 90' })
  lat: number;

  @ApiProperty({
    description: 'Description for a report',
    default: '',
  })
  @IsString({ message: 'Description must be a string' })
  description: string;

  @ApiProperty({
    description: 'Id of the report creator',
    minimum: 0,
  })
  @Transform(({ value }) => parseInt(value))
  @IsDefined({ message: 'User ID is obligatory' })
  @IsNumber({ allowNaN: false })
  @Min(0, { message: 'User ID should be poitive' })
  submittedByUserId: number;
}
