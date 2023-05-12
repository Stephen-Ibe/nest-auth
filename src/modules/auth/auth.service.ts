import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register.dto';
import {
  ErrorHandler,
  PasswordHelper,
  PhoneNumberHandler,
  Utils,
} from 'src/utils';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async register(payload: RegisterUserDto) {
    const userExists = await this.userRepo.findOne({
      where: { email: payload.email.toLowerCase() },
    });

    if (userExists) {
      ErrorHandler.BadRequestException('User with this email already exists');
    }

    const hashPassword = await PasswordHelper.hashPassword(payload.password);

    const user = await this.userRepo.save(
      this.userRepo.create({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email.toLowerCase(),
        password: hashPassword,
      }),
    );

    return user;
  }

  async checkIfUserExists({
    email,
    phoneNumber,
  }: {
    email: string;
    phoneNumber: string;
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
