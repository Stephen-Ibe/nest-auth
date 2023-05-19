export class HttpResponse {
  static success(payload: { data?: any; message: string }) {
    return {
      success: true,
      data: payload.data,
      message: payload.message,
    };
  }

  static badRequest(payload: { data: any; message: string }) {
    return {
      success: false,
      data: payload.data,
      message: payload.message,
    };
  }
}
