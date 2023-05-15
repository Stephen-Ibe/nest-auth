import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guards';
import { IUser, IUserRequest } from './types';
import { HttpResponse } from 'src/utils';
import { UpdateUserProfileDto } from './dto';
import { UserDecorator } from 'src/decorators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get()
  /**
   * @param  {} @Request(
   * @param  {IUserRequest} {user}
   * @returns Promise
   */
  async getUserProfile(
    @Request() { user }: IUserRequest,
  ): Promise<Record<string, any>> {
    const data = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      isVerified: user.isVerified,
      email: user.email,
      phoneNumber: user.phoneNumber,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    };

    return HttpResponse.success({
      data,
      message: 'User fetched successfully',
    });
  }

  @HttpCode(HttpStatus.OK)
  @Put('update-profile')
  @UseGuards(AuthGuard)
  /**
   * @param  {} @Body(
   * @param  {UpdateUserProfileDto} body
   * @param  {} @UserDecorator(
   * @param  {IUser} user
   * @returns Promise
   */
  async updateProfile(
    @Body() body: UpdateUserProfileDto,
    @UserDecorator() user: IUser,
  ): Promise<Record<string, any>> {
    const data = await this.userService.updateProfile(user.id, body);

    return HttpResponse.success({
      data,
      message: 'Profile updated successfully',
    });
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Delete('delete-profile')
  /**
   * @param  {} @Request(
   * @param  {IUserRequest} {user}
   * @returns Promise
   */
  async deleteProfile(
    @Request() { user }: IUserRequest,
  ): Promise<Record<string, any>> {
    await this.userService.deleteProfile(user.id);
    return HttpResponse.success({
      data: {},
      message: 'Profile deleted successfully',
    });
  }
}
