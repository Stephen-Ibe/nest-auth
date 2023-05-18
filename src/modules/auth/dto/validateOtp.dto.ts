import { IsString } from 'class-validator';

export class ValidateRegistrationOtp {
  @IsString()
  code: string;
}
