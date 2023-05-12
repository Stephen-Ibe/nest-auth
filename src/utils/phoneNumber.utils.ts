import { ErrorHandler } from './error.utils';

export class PhoneNumberHandler {
  static formatToCountryStandard(number: string) {
    if (number.startsWith('0') && number.length === 10) {
      return `234${number}`;
    }

    ErrorHandler.BadRequestException('Invalid phone number');
  }
}
