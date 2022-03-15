import { ApiError } from '../api-error/index.js';
import * as tokenService from '../token/service.js';

export const authMiddleware = (request, response, next) => {
  try {
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      return next(ApiError.Unauthorized());
    }
    const [, accessToken] = authorizationHeader.split(' ');

    if (!accessToken) {
      return next(ApiError.Unauthorized());
    }

    const userData = tokenService.validateAccessToken(accessToken);

    if (!userData) {
      return next(ApiError.Unauthorized());
    }

    request.user = userData.user;
    next();
  } catch (error) {
    return next(ApiError.Unauthorized());
  }
};
