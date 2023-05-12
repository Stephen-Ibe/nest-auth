import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CheckUserDto {
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @IsOptional()
  phoneNumber: string;
}
