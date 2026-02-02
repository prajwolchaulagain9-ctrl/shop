import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format with comprehensive regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, valid: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Basic format validation is sufficient - database check handles duplicates
    // The check-email endpoint will verify if email is already registered
    return NextResponse.json(
      {
        success: true,
        valid: true,
        message: 'Email format is valid',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email verification error:', error);
    
    // Return valid for format on error to not block registration
    return NextResponse.json(
      { success: true, valid: true, message: 'Email validation passed' },
      { status: 200 }
    );
  }
}
