import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserProfileDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async updateProfile(userId: string, payload: UpdateUserProfileDto) {
    const user = await this.userRepo.findOne({
      where: {
        id: userId,
      },
    });

    return user;
  }
}
