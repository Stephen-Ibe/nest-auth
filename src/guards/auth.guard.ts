import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ErrorHandler } from 'src/utils';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authorization = req.headers['authorization'];

    if (!authorization) {
      ErrorHandler.UnauthorizedException(
        'Unauthorized! Authorization header is missing',
      );
    }

    const user = await this.verifyAccessToken(authorization);

    req.user = user;
    return true;
  }

  async verifyAccessToken(authorization: string) {
    const [bearer, accessToken] = authorization.split(' ');

    if (bearer !== 'Bearer') {
      ErrorHandler.UnauthorizedException('Authorization should be Bearer');
    }

    if (!accessToken) {
      ErrorHandler.UnauthorizedException('Access token is missing');
    }

    try {
      const payload = this.jwtService.verify(accessToken);
      const user = payload;

      if (!user) {
        ErrorHandler.UnauthorizedException('Unauthorized');
      }

      return user;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        ErrorHandler.UnauthorizedException('Token expired');
      }
      ErrorHandler.UnauthorizedException(error.message);
    }
  }
}
