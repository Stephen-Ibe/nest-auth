import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register.dto';
import { ErrorHandler, PasswordHelper } from 'src/utils';

@Injectable()
export class AuthService {
  constructor(
    // private jwtService: JwtService,
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
}
