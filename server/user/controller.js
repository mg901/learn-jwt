import dayjs from 'dayjs';

import { validationResult } from 'express-validator';
import * as userService from './service.js';
import { ApiError } from '../api-error/index.js';

export const registration = async (request, response, next) => {
  try {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      next(ApiError.BadRequest('Validation error', errors.array()));
    }

    const { email, password } = request.body;
    const userData = await userService.registration(email, password);

    setRefreshToken(userData, response);
    response.json(userData);
  } catch (error) {
    next(error);
  }
};

export const activate = async (request, response, next) => {
  try {
    const activationLink = request.params.link;
    await userService.activate(activationLink);

    response.redirect(process.env.CLIENT_URL);
  } catch (error) {
    next(error);
  }
};

export const login = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    const userData = await userService.login(email, password);

    setRefreshToken(userData, response);
    response.json(userData);
  } catch (error) {
    next(error);
  }
};

export const logout = async (request, response, next) => {
  try {
    const { refreshToken } = request.cookies;
    await userService.logout(refreshToken);

    response.clearCookie('refreshToken');
    response.status(200).json({ message: 'Cookies cleared' });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (request, response, next) => {
  try {
    const { refreshToken } = request.cookies;
    const userData = await userService.refresh(refreshToken);

    setRefreshToken(userData, response);
    response.json(userData);
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (request, response, next) => {
  try {
    response.json(await userService.getAllUsers());
  } catch (error) {
    next(error);
  }
};

function setRefreshToken(user, response) {
  response.cookie('refreshToken', user.refreshToken, {
    expires: dayjs().add(30, 'days').toDate(),
    httpOnly: true,
  });
}
