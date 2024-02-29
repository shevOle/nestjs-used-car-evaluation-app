import { IsString, IsEmail, MinLength } from 'class-validator';

export class CreateUserRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  password: string;
}
