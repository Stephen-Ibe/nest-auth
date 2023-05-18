import { Injectable } from '@nestjs/common';
import { TwilioService } from 'nestjs-twilio';
import { OtpHandler } from 'src/utils';
import { Otp } from './entities/otp.entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IOtpType } from './otp.interface';

@Injectable()
export class OtpService {
  constructor(
    private readonly twilioService: TwilioService,
    @InjectRepository(Otp)
    private readonly otpRepo: Repository<Otp>,
  ) {}

  async sendSMS(code: string, destinationNumber: string) {
    return this.twilioService.client.messages.create({
      body: `Your verification code is ${code}. Do not share this code with any person.`,
      from: '+12543263691',
      to: destinationNumber,
    });
  }

  async saveAndSendOtp(user: any, type: IOtpType) {
    try {
      const otp = OtpHandler.generateOtp(5);
      await this.otpRepo.save({
        code: otp,
        userId: user.id,
        type,
      });
      const res = await this.sendSMS(otp, '+2349034587133');

      return res;
    } catch (err: any) {
      return err;
    }
  }
}
