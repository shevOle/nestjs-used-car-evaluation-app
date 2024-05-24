import { IsEmail, IsString, IsOptional } from 'class-validator';

export class UpdateUserRequestDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  profilePicture?: string;
}
