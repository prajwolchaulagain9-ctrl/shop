import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/utils/auth';

export async function POST() {
  try {
    const response = NextResponse.json(
      {
        success: true,
        message: 'Logged out successfully',
      },
      { status: 200 }
    );
    
    // Clear httpOnly cookie
    clearAuthCookie(response);
    
    return response;
  } catch (error: unknown) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: (error instanceof Error ? error.message : null) || 'Logout failed' },
      { status: 500 }
    );
  }
}
