import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entities';
import { OtpService } from './otp.service';
import { TwilioModule } from 'nestjs-twilio';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../user/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Otp, User]),
    TwilioModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        accountSid: configService.get('TWILIO_ACCOUNT_SID'),
        authToken: configService.get('TWILIO_AUTH_TOKEN'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
