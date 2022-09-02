export class AppError {
  status: string;
  message: string;

  constructor(status = 'internal_server_error', message = 'Something went wrong') {
    this.status = status;
    this.message = message;
  }
}
