import { ErrorHandler } from './error.utils';

export class PhoneNumberHandler {
  static formatToCountryStandard(number: string) {
    if (number.startsWith('0') && number.length === 10) {
      return `234${number}`;
    }

    if (number.startsWith('0') && number.length === 11) {
      return `234${number.slice(1)}`;
    }

    if (number.startsWith('234') && number.length === 13) {
      return number;
    }

    if (number.startsWith('2340') && number.length === 14) {
      return `234${number.slice(4)}`;
    }

    if (number.startsWith('+234') && number.length === 14) {
      return number.slice(1);
    }

    if (number.startsWith('+2340') && number.length === 15) {
      return `234${number.slice(5)}`;
    }

    ErrorHandler.BadRequestException('Invalid phone number');
  }
}
