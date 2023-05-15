import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register.dto';
import { HttpResponse } from 'src/utils/http-response.utils';
import { LoginUserDto } from './dto/login.dto';
import { CheckUserDto, ResetPasswordDto } from './dto';

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
  async register(@Body() body: RegisterUserDto): Promise<Record<string, any>> {
    const data = await this.authService.register(body);

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
