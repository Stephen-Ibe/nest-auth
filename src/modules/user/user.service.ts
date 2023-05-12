import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register.dto';
import { ErrorHandler } from 'src/utils/error.utils';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async register(payload: RegisterUserDto) {
    const userExists = await this.userRepo.findOne({
      where: { email: payload.email.toLowerCase() },
    });

    if (userExists) {
      ErrorHandler.BadRequestException('User with this email already exists');
    }

    const user = await this.userRepo.save(
      this.userRepo.create({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email.toLowerCase(),
      }),
    );

    return user;
  }
}
