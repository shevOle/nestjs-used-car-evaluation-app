import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ReportStatuses } from '../../db/entities/report.entity';

export class GetReportsRequestDto {
  @ApiProperty({
    description: 'Page number for pagination',
    minimum: 0,
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber({ allowNaN: false })
  @Min(0, { message: 'Page should be a positive number' })
  @IsOptional()
  page: number;

  @ApiProperty({
    description: 'Pagge size for pagination',
    minimum: 0,
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber({ allowNaN: false })
  @Min(0, { message: 'Page size should be a positive number' })
  @IsOptional()
  perPage: number;

  @ApiProperty({
    description: 'Limit for number of documents in a response',
    minimum: 0,
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber({ allowNaN: false })
  @Min(0, { message: 'Limit should be a positive number' })
  @IsOptional()
  limit: number;

  @ApiProperty({
    description: 'What is the model of the car',
  })
  @IsString({ message: 'Model must be a string' })
  @IsOptional()
  model: string;

  @ApiProperty({
    description: 'What is the model of the car',
  })
  @IsString({ message: 'Manufacturer must be a string' })
  @IsOptional()
  make: string;

  @ApiProperty({
    description: 'Status of the needed reports',
  })
  @IsEnum(ReportStatuses, {
    message: 'Status should be one of: new, approved, rejected',
  })
  @IsOptional()
  status: string;

  @ApiProperty({
    description: 'What year the car was made in',
    minimum: 1990,
    maximum: 2030,
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber({ allowNaN: false })
  @Min(1990, { message: 'Year value must be from 1990 to 2030' })
  @Max(2030, { message: 'Year value must be from 1990 to 2030' })
  @IsOptional()
  year: number;
}
