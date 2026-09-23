import jwt from 'jsonwebtoken';

const generateToken = (id: string, role: string) => {
  const accessToken = jwt.sign({ id, role }, process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'secret', {
    expiresIn: '1d', // 1 day
  });

  const refreshToken = jwt.sign({ id, role }, process.env.JWT_REFRESH_SECRET || 'refreshSecret', {
    expiresIn: '7d', // 7 days
  });

  return { accessToken, refreshToken };
};

export default generateToken;
