// src/auth/dto/auth-credentials.dto.ts
import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class AuthCredentialsDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(4, { message: 'Password must be at least 4 characters long' })
  @MaxLength(20, { message: 'Password must be at most 20 characters long' })
  //@Matches(/(?=.*[0-9])(?=.*[!@#$%^&*])/,{ message: 'Password must contain at least one number and one special character' })
  password: string;
}