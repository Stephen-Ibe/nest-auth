import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { ErrorHandler, PasswordHelper, Utils } from 'src/utils';
import { LoginUserDto, RegisterUserDto, ResetPasswordDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /**
   * Register a user - Signup
   * @param  {RegisterUserDto} payload
   */
  async register(payload: RegisterUserDto) {
    // check if user exists
    const { email } = await this.checkIfUserExists({
      email: payload.email,
      // phoneNumber: payload.phoneNumber,
    });

    let user: any;
    let target: string;

    // add || phoneNumber to check if phoneNumber exists
    if (email) {
      // if (phoneNumber) {
      //   target = 'phone';
      //   const formattedNumber = PhoneNumberHandler.formatToCountryStandard(
      //     payload.phoneNumber,
      //   );
      //   user = await this.userRepo.findOne({
      //     where: { phoneNumber: formattedNumber },
      //   });
      // }

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
          `User with this ${target} already exists`,
        );
      }
    }

    const hashPassword = await PasswordHelper.hashPassword(payload.password);

    const registeredUser = await this.userRepo.save(
      this.userRepo.create({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email.toLowerCase(),
        password: hashPassword,
      }),
    );

    return this.signToken(registeredUser);
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
      createdAt: userData.createdAt,
    };
    const token = this.jwtService.sign(user);

    return { user: { ...user }, accessToken: token };
  }

  async checkIfUserExists({
    email,
  }: // phoneNumber,
  {
    email: string;
    // phoneNumber?: string;
  }) {
    const data = { email: false, phoneNumber: false };

    if (email) {
      const validEmail = Utils.isEmail(email);
      const user = await this.userRepo.count({ where: { email: validEmail } });
      data.email = user > 0;
    }

    // if (phoneNumber) {
    //   const formattedNumber =
    //     PhoneNumberHandler.formatToCountryStandard(phoneNumber);
    //   const user = await this.userRepo.count({
    //     where: { phoneNumber: formattedNumber },
    //   });
    //   data.phoneNumber = user > 0;
    // }

    return data;
  }
}
