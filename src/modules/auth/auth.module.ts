import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { OtpModule } from '../otp/otp.module';
import { Otp } from '../otp/entities/otp.entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Otp]),
    JwtModule.register({
      secret: 'JWT_SECRET',
      signOptions: { expiresIn: '1h' },
      global: true,
    }),
    OtpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
