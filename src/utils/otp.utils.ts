export class OtpHandler {
  static generateOtp(length: number): string {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i <= length; i += 1) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  }
}
