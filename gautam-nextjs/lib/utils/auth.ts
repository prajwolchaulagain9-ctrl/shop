import jwt, { SignOptions } from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { NextResponse } from 'next/server';

// Validate JWT_SECRET is set
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required but not set');
  }

const JWT_SECRET = process.env.JWT_SECRET;

const COOKIE_NAME = 'auth_token';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

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
  } catch {
    return null;
  }
};

export const getTokenFromRequest = (request: Request) => {
  // Parse cookies from request header manually (sync operation)
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const match = cookieHeader.match(new RegExp(`(^|;\\s*)${COOKIE_NAME}=([^;]+)`));
    if (match) {
      return match[2];
    }
  }
  
  // Fallback to Authorization header for backwards compatibility (temporary)
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  
  return null;
};

// Helper to set auth cookie in response
export const setAuthCookie = (response: NextResponse, token: string) => {
  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
  return response;
};

// Helper to clear auth cookie
export const clearAuthCookie = (response: NextResponse) => {
  response.cookies.set({
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  return response;
};
