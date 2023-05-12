import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { Match } from 'src/decorators';

export class ResetPasswordDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @Match<ResetPasswordDto>('password')
  confirmPassword: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
