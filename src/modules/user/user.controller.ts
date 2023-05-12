import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guards';
import { IUserRequest } from './types';
import { HttpResponse } from 'src/utils';
import { UpdateUserProfileDto } from './dto';
import { UserDecorator } from 'src/decorators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get()
  async getUserProfile(@Request() { user }: IUserRequest) {
    const userData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      isVerified: user.isVerified,
      email: user.email,
      phoneNumber: user.phoneNumber,
      createdAt: user.createdAt,
    };

    return HttpResponse.success({
      data: userData,
      message: 'User fetched successfully',
    });
  }

  @Put('update-profile')
  @UseGuards(AuthGuard)
  async updateProfile(
    @Body() body: UpdateUserProfileDto,
    @UserDecorator() user: IUserRequest,
  ) {
    const data = { ...body, user };
    return data;
  }
}
