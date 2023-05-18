import { Injectable } from '@nestjs/common';
import { TwilioService } from 'nestjs-twilio';
import { ErrorHandler, OtpHandler } from 'src/utils';
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

  async sendSMS(destinationNumber: string, message: string) {
    return this.twilioService.client.messages.create({
      body: message,
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
      const res = await this.sendSMS(
        '+2349034587133',
        `Your verification code is ${otp}. Do not share this code with any person.`,
      );

      return res;
    } catch (err: any) {
      return err;
    }
  }

  async verifyOtp(otp: string, userId: string, type: IOtpType) {
    const otpIsValid = await this.otpRepo.findOne({
      where: { code: otp, userId, type },
    });

    if (!otpIsValid || otpIsValid.isUsed) return false;

    const payload = {
      isUsed: true,
    };

    await this.otpRepo.update(otpIsValid.id, payload);

    return true;
  }
}
