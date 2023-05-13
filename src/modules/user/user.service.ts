import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserProfileDto } from './dto';
import { ErrorHandler } from 'src/utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  /**
   * @param  {string} userId
   * @param  {UpdateUserProfileDto} body
   * @returns Promise
   */
  async updateProfile(
    userId: string,
    body: UpdateUserProfileDto,
  ): Promise<Record<string, any>> {
    const user = await this.userRepo.findOne({
      where: {
        id: userId,
      },
    });
    if (body.email) {
      const emailExist = await this.userRepo.findOne({
        where: { email: body.email },
      });

      if (emailExist && emailExist.id !== userId) {
        ErrorHandler.ConflictException('Email already exists');
      }
    }

    const payload = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phoneNumber: body.phoneNumber,
    };

    await this.userRepo.update(user.id, payload);

    return {
      firstName: payload.firstName || user.firstName,
      lastName: payload.lastName || user.lastName,
      email: payload.email || user.email,
      phoneNumber: payload.phoneNumber || user.phoneNumber,
    };
  }

  /**
   * @param  {string} userId
   * @returns Promise
   */
  async deleteProfile(userId: string): Promise<boolean> {
    await this.userRepo.softDelete(userId);

    return true;
  }
}
