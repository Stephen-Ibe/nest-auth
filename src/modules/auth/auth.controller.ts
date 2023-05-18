import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register.dto';
import { HttpResponse } from 'src/utils/http-response.utils';
import { LoginUserDto } from './dto/login.dto';
import { CheckUserDto, ResetPasswordDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/guards';
import { ValidateRegistrationOtp } from './dto/validateOtp.dto';
import { IOtpType } from '../otp/otp.interface';
import { UserDecorator } from 'src/decorators';
import { IUser } from '../user/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * @param  {} @Body(
   * @param  {RegisterUserDto} body
   * @returns Promise
   */
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @UseInterceptors(FileInterceptor('photo'))
  async register(
    @Body() body: RegisterUserDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: '.(png|jpeg|jpg)',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ): Promise<Record<string, any>> {
    const data = await this.authService.register(body, file);

    return HttpResponse.success({ data, message: 'User created successfully' });
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  /**
   * @param  {} @Body(
   * @param  {LoginUserDto} body
   * @returns Promise
   */
  async login(@Body() body: LoginUserDto): Promise<Record<string, any>> {
    const data = await this.authService.login(body);

    return HttpResponse.success({
      data,
      message: 'Login successfully',
    });
  }

  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    await this.authService.resetPassword(body);
    return '';
  }

  @Post('verify')
  @UseGuards(AuthGuard)
  async verifyRegistrationOtp(
    @Body() body: ValidateRegistrationOtp,
    @UserDecorator() user: IUser,
  ) {
    const payload = { ...body, ...user };
    const data = await this.authService.validateOtp(payload, IOtpType.REGISTER);

    console.log(data);

    return HttpResponse.success({
      data,
      message: 'User Verified Successfully',
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('verify-user')
  /**
   * @param  {} @Body(
   * @param  {CheckUserDto} body
   * @returns Promise
   */
  async checkUser(@Body() body: CheckUserDto): Promise<Record<string, any>> {
    const { email } = await this.authService.checkIfUserExists({
      email: body.email,
    });

    const data = {
      email,
    };

    return HttpResponse.success({ data, message: 'User Identified validated' });
  }
}
