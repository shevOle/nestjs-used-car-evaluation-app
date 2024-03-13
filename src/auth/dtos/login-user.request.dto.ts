import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength } from 'class-validator';

export class LoginUserRequestDto {
  @ApiProperty({
    description: 'An email for user login',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'A password for user login',
    minLength: 3,
  })
  @IsString({ message: 'Password should be a string' })
  @MinLength(3, { message: 'Pasword should have at least 3 symbols' })
  password: string;
}
