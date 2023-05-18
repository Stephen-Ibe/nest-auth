import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from 'nestjs-cloudinary';
import {
  ErrorHandler,
  PasswordHelper,
  PhoneNumberHandler,
  Utils,
} from 'src/utils';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { LoginUserDto, RegisterUserDto, ResetPasswordDto } from './dto';
import { OtpService } from '../otp/otp.service';
import { IOtpType } from '../otp/otp.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly cloudinaryService: CloudinaryService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly otpService: OtpService,
  ) {}

  /**
   * Register a user - Signup
   * @param  {RegisterUserDto} payload
   */
  async register(payload: RegisterUserDto, file: Express.Multer.File) {
    // check if user exists
    const { email, phoneNumber } = await this.checkIfUserExists({
      email: payload.email,
      phoneNumber: payload.phoneNumber,
    });

    let user: any;
    let target: string;

    if (email || phoneNumber) {
      if (phoneNumber) {
        target = 'phone';
        const formattedNumber = PhoneNumberHandler.formatToCountryStandard(
          payload.phoneNumber,
        );
        user = await this.userRepo.findOne({
          where: { phoneNumber: formattedNumber },
        });
      }

      if (email) {
        target = 'email';
        user = await this.userRepo.findOne({
          where: { email: payload.email.toLowerCase() },
        });
      }

      if (user && user.deletedAt) {
        ErrorHandler.ConflictException(
          `A deleted account exisits with the specified ${target}`,
        );
      } else {
        ErrorHandler.BadRequestException(
          `User with ${target} already exists. Please login to continue`,
        );
      }
    }

    const avatar = await this.cloudinaryService.uploadFile(file);
    const hashPassword = await PasswordHelper.hashPassword(payload.password);

    const registeredUser = await this.userRepo.save(
      this.userRepo.create({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email.toLowerCase(),
        password: hashPassword,
        phoneNumber: payload.phoneNumber,
        avatarUrl: avatar.url,
      }),
    );

    const res = await this.otpService.saveAndSendOtp(
      registeredUser,
      IOtpType.REGISTER,
    );

    if (res.errorCode === null) {
      return this.signToken(registeredUser);
    } else {
      return ErrorHandler.BadRequestException(
        'Invalid Number! Please check destination number to complete verification.',
      );
    }
  }

  /**
   * Login
   * @param  {LoginUserDto} payload
   */
  async login(payload: LoginUserDto) {
    const user = await this.userRepo.findOne({
      where: { email: payload.email.toLowerCase() },
    });

    if (!user || user.deletedAt) {
      ErrorHandler.BadRequestException('User not found');
    }

    const passwordIsCorrect = user
      ? await PasswordHelper.comparePassword(payload.password, user.password)
      : null;

    if (!user || !passwordIsCorrect) {
      ErrorHandler.BadRequestException('Email or Password is incorrect');
    }

    return this.signToken(user);
  }

  /**
   * Validate OTP
   * @param  {} payload
   * @param  {IOtpType} type
   */
  async validateOtp(
    payload: Record<string, any>,
    type: IOtpType,
  ): Promise<Record<string, any>> {
    const isValid = await this.otpService.verifyOtp(
      payload.code,
      payload.id,
      type,
    );

    if (!isValid) {
      ErrorHandler.BadRequestException('Invalid Code.');
    }

    await this.userRepo.update(payload.id, { isVerified: true });

    return {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
    };
  }

  async resetPassword(payload: ResetPasswordDto) {
    return payload;
  }

  private signToken(userData: User): {
    user: Record<string, unknown>;
    accessToken: string;
  } {
    const user = {
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      isVerified: userData.isVerified,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      avatarUrl: userData.avatarUrl,
      createdAt: userData.createdAt,
    };
    const token = this.jwtService.sign(user);

    return { user: { ...user }, accessToken: token };
  }

  async checkIfUserExists({
    email,
    phoneNumber,
  }: {
    email: string;
    phoneNumber?: string;
  }) {
    const data = { email: false, phoneNumber: false };

    if (email) {
      const validEmail = Utils.isEmail(email);
      const user = await this.userRepo.count({ where: { email: validEmail } });
      data.email = user > 0;
    }

    if (phoneNumber) {
      const formattedNumber =
        PhoneNumberHandler.formatToCountryStandard(phoneNumber);
      const user = await this.userRepo.count({
        where: { phoneNumber: formattedNumber },
      });
      data.phoneNumber = user > 0;
    }

    return data;
  }
}
