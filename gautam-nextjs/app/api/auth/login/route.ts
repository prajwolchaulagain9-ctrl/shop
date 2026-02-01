import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/lib/models/User';
import { comparePassword, generateToken } from '@/lib/utils/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide email and password' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 400 }
      );
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 400 }
      );
    }

    // Generate token
    const token = generateToken(user._id.toString());

    // Return user data
    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: userResponse,
        token,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Login failed' },
      { status: 500 }
    );
  }
}
