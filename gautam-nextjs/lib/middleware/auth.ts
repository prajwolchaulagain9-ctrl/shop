/**
 * Admin authentication middleware
 * Verifies JWT token and checks if user has admin role
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest } from '@/lib/utils/auth';
import User from '@/lib/models/User';
import connectDB from '@/lib/db/connect';

export interface AuthenticatedUser {
  userId: string;
  role: string;
  email: string;
}

/**
 * Verify that the request is from an authenticated admin user
 * @param request - Next.js request object
 * @returns User object if authenticated and admin, null otherwise
 */
export async function requireAdmin(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    // Get token from request (cookies or Authorization header)
    const token = getTokenFromRequest(request);
    if (!token) {
      return null;
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return null;
    }

    // Get user from database and verify admin role
    await connectDB();
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== 'admin') {
      return null;
    }

    return {
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    };
  } catch (error) {
    console.error('Admin auth error:', error);
    return null;
  }
}

/**
 * Create a standardized unauthorized response
 */
export function unauthorizedResponse(message = 'Unauthorized'): NextResponse {
  return NextResponse.json(
    { success: false, error: message },
    { status: 401 }
  );
}

/**
 * Create a standardized forbidden response
 */
export function forbiddenResponse(message = 'Forbidden - Admin access required'): NextResponse {
  return NextResponse.json(
    { success: false, error: message },
    { status: 403 }
  );
}

/**
 * Verify any authenticated user (not necessarily admin)
 */
export async function requireAuth(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return null;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return null;
    }

    await connectDB();
    const user = await User.findById(decoded.userId);

    if (!user) {
      return null;
    }

    return {
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    };
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}
