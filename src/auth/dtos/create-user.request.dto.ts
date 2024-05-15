import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class CreateUserRequestDto {
  @ApiProperty({
    description: 'An email for user creation',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'A password for user creation',
    minLength: 3,
  })
  @IsString({ message: 'Password should be a string' })
  @MinLength(3, { message: 'Pasword should have at least 3 symbols' })
  password: string;

  @ApiProperty({
    description: 'Profile picture for users',
  })
  @IsString()
  @IsNotEmpty()
  profilePicture: string;
}
