import jwt from 'jsonwebtoken';
import TokenModel from './model.js';

export const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: '30d',
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const saveToken = async (userId, refreshToken) => {
  const foundToken = await TokenModel.findOne({ user: userId });
  if (foundToken) {
    foundToken.refreshToken = refreshToken;

    return foundToken.save();
  }
  const token = await TokenModel.create({ user: userId, refreshToken });

  return token;
};

export const removeToken = async (refreshToken) => {
  await TokenModel.deleteOne({ refreshToken });
};

export const findToken = async (refreshToken) => {
  const foundToken = await TokenModel.findOne({ refreshToken });

  return foundToken;
};

export const validateAccessToken = (accessToken) => {
  try {
    const userData = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_TOKEN_SECRET,
    );

    return userData;
  } catch (error) {
    return null;
  }
};

export const validateRefreshToken = (refreshToken) => {
  try {
    const userData = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET,
    );

    return userData;
  } catch (error) {
    return null;
  }
};
