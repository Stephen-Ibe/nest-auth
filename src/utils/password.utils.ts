import * as bcrypt from 'bcrypt';

export class PasswordHelper {
  static hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  static comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}
