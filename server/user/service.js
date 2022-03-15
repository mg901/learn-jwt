import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import UserModel from './model.js';
import * as mailService from '../mail/service.js';
import * as tokenService from '../token/service.js';
import { makeDto } from './dto.js';
import { ApiError } from '../api-error/index.js';

export const registration = async (email, password) => {
  const candidate = await UserModel.findOne({ email });

  if (candidate) {
    throw ApiError.BadRequest(`User with ${email} already exists`);
  }

  const hashedPassword = await bcrypt.hash(password, 3);
  const activationLink = nanoid();
  const user = await UserModel.create({
    email,
    password: hashedPassword,
    activationLink,
  });

  await mailService.sendActivationMail(
    email,
    `${process.env.API_URL}/api/activate/${activationLink}`,
  );

  return createUserPayload(user);
};

export const activate = async (activationLink) => {
  const user = await UserModel.findOne({ activationLink });

  if (!user) {
    throw ApiError.BadRequest('Invalid activation link');
  }

  user.isActivated = true;
  await user.save();
};

export const login = async (email, password) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw ApiError.BadRequest(`User with ${email} was not found`);
  }

  const isPassEqual = await bcrypt.compare(password, user.password);

  if (!isPassEqual) {
    throw ApiError.BadRequest('Invalid password');
  }

  return createUserPayload(user);
};

export const logout = async (refreshToken) => {
  await tokenService.removeToken(refreshToken);
};

export const refresh = async (refreshToken) => {
  if (!refreshToken) {
    throw ApiError.Unauthorized();
  }

  const verifiedUser = tokenService.validateRefreshToken(refreshToken);
  const tokenFromDB = tokenService.findToken(refreshToken);

  if (!verifiedUser || !tokenFromDB) {
    throw ApiError.Unauthorized();
  }

  const user = await UserModel.findById(verifiedUser.id);

  return createUserPayload(user);
};

export const getAllUsers = async () => {
  const users = await UserModel.find();

  return users;
};

async function createUserPayload(user) {
  const userDto = makeDto(user);
  const tokens = tokenService.generateTokens(userDto);
  await tokenService.saveToken(userDto.id, tokens.refreshToken);

  return {
    ...tokens,
    user: userDto,
  };
}
