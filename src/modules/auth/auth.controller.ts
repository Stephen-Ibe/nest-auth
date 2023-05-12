import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register.dto';
import { HttpResponse } from 'src/utils/http-response.utils';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterUserDto) {
    const data = await this.authService.register(body);

    return HttpResponse.success({ data, message: 'USer created successfully' });
  }
}
