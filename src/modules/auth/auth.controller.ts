import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register.dto';
import { HttpResponse } from 'src/utils/http-response.utils';
import { LoginUserDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterUserDto) {
    const data = await this.authService.register(body);

    return HttpResponse.success({ data, message: 'User created successfully' });
  }

  @Post('login')
  async login(@Body() body: LoginUserDto) {
    const data = await this.authService.login(body);

    return HttpResponse.success({
      data,
      message: 'Login successfully',
    });
  }
}
