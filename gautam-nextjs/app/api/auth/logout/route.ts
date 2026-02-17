import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/utils/auth';

export async function POST(request: NextRequest) {
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
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Logout failed' },
      { status: 500 }
    );
  }
}
