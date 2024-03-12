import { IsString, IsEmail, MinLength } from 'class-validator';

export class LoginUserRequestDto {
  @IsEmail()
  email: string;

  @IsString({ message: 'Password should be a string' })
  @MinLength(3, { message: 'Pasword should have at least 3 symbols' })
  password: string;
}
