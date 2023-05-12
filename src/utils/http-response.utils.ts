export class HttpResponse {
  static success(payload: { data: any; message: string }) {
    return payload;
  }
}
