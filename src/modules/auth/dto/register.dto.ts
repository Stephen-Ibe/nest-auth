import {
  IsEmail,
  IsNotEmpty,
  // IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 25)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 25)
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  // @IsOptional()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 50)
  @Matches(/.*[0-9].*/, { message: 'Password should contain one digit' })
  password: string;
}
