import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MinLength(3)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  mobile: string;

  @IsOptional()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  @IsDateString()
  dob: Date;
}
