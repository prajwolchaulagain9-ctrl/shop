import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken, generateToken } from '@/lib/utils/auth';
import connectDB from '@/lib/db/connect';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    await connectDB();
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Generate new token
    const newToken = generateToken(user._id.toString());

    return NextResponse.json(
      {
        success: true,
        message: 'Token refreshed',
        token: newToken,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { success: false, message: (error instanceof Error ? error.message : null) || 'Token refresh failed' },
      { status: 500 }
    );
  }
}
