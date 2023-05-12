import { HttpException, HttpStatus } from '@nestjs/common';

export class ErrorHandler {
  static BadRequestException(msg: string | string[]) {
    throw new HttpException(msg, HttpStatus.BAD_REQUEST);
  }
}
