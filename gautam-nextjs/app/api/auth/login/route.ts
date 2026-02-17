import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/lib/models/User';
import { comparePassword, generateToken, setAuthCookie } from '@/lib/utils/auth';
import { checkRateLimit, getClientIp, RateLimitPresets } from '@/lib/utils/rateLimit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 5 attempts per 15 minutes per IP
    const ip = getClientIp(request);
    const rateLimitResult = checkRateLimit({
      identifier: ip,
      namespace: 'login',
      ...RateLimitPresets.LOGIN,
    });
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Too many login attempts. Please try again in ${rateLimitResult.resetIn} seconds.` 
        },
        { status: 429 }
      );
    }
    
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
    
    // Check if email is verified
    if (!user.isEmailVerified) {
      return NextResponse.json(
        { success: false, message: 'Please verify your email before logging in. Check your inbox for the OTP.' },
        { status: 403 }
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

    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: userResponse,
      },
      { status: 200 }
    );
    
    // Set httpOnly cookie
    setAuthCookie(response, token);
    
    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Login failed' },
      { status: 500 }
    );
  }
}
