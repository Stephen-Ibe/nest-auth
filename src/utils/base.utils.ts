import * as isemail from 'isemail';
import { ErrorHandler } from './error.utils';
import { validateOrReject } from 'class-validator';

export class Utils {
  static isEmail(email: string) {
    const isValid = isemail.validate(email);
    if (!isValid) {
      ErrorHandler.BadRequestException('Invalid email');
    }

    return email;
  }

  static async validateObject(Schema: any, data: object) {
    const object = Object.assign(new Schema(), data);

    try {
      await validateOrReject(object, { validateError: { target: false } });
      return object;
    } catch (errors) {
      const error = Object.values(errors[0]?.constraints)[0] as string;
      throw new Error(error || 'Validation error');
    }
  }
}
