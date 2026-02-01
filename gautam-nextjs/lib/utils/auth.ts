import jwt, { SignOptions } from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const hashPassword = async (password: string) => {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
};

export const comparePassword = async (password: string, hashedPassword: string) => {
  return bcryptjs.compare(password, hashedPassword);
};

export const generateToken = (userId: string) => {
  const options: SignOptions = {
    expiresIn: '7d',
  };
  return jwt.sign({ userId }, JWT_SECRET, options);
};

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  } catch (error) {
    return null;
  }
};

export const getTokenFromRequest = (request: Request) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7);
};
