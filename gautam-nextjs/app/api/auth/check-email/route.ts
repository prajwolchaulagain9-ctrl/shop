import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if email already exists in database
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return NextResponse.json(
        { success: false, exists: true, message: 'This email is already registered' },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: true, exists: false, message: 'Email is available' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Check email error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to check email' },
      { status: 500 }
    );
  }
}
