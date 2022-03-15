export class ApiError extends Error {
  constructor(message, status, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static Unauthorized() {
    return new ApiError('user is not authorized', 401);
  }

  static BadRequest(message, errors) {
    return new ApiError(message, 400, errors);
  }
}
