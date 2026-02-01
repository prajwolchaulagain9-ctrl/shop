import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    return NextResponse.json(
      {
        success: true,
        message: 'Logged out successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Logout failed' },
      { status: 500 }
    );
  }
}
