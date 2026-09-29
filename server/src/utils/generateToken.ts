import jwt from 'jsonwebtoken';

export const getAccessTokenSecret = () => {
  const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
  if (!secret || secret === 'your_access_token_secret_here') {
    throw new Error('JWT_ACCESS_SECRET must be configured with a strong secret');
  }
  return secret;
};

export const getRefreshTokenSecret = () => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret || secret === 'your_refresh_token_secret_here') {
    throw new Error('JWT_REFRESH_SECRET must be configured with a strong secret');
  }
  return secret;
};

const generateToken = (id: string, role: string) => {
  const accessToken = jwt.sign({ id, role }, getAccessTokenSecret(), {
    expiresIn: '1d', // 1 day
  });

  const refreshToken = jwt.sign({ id, role }, getRefreshTokenSecret(), {
    expiresIn: '7d', // 7 days
  });

  return { accessToken, refreshToken };
};

export default generateToken;
