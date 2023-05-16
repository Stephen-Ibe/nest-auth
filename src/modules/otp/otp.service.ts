import { Injectable } from '@nestjs/common';
import { TwilioService } from 'nestjs-twilio';

@Injectable()
export class OtpService {
  constructor(private readonly twilioService: TwilioService) {}

  async sendSMS(code: string, senderNumber: string, destinationNumber: string) {
    return this.twilioService.client.messages.create({
      body: `Your verification code is ${code}. Do not share this code with amy person.`,
      from: senderNumber,
      to: destinationNumber,
    });
  }
}
