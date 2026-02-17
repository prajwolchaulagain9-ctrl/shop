import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/lib/models/User';
import { hashPassword, generateToken, setAuthCookie } from '@/lib/utils/auth';
import { checkRateLimit, getClientIp, RateLimitPresets } from '@/lib/utils/rateLimit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 3 registrations per hour per IP
    const ip = getClientIp(request);
    const rateLimitResult = checkRateLimit({
      identifier: ip,
      namespace: 'register',
      ...RateLimitPresets.REGISTER,
    });
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Too many registration attempts. Please try again in ${Math.ceil(rateLimitResult.resetIn! / 60)} minutes.` 
        },
        { status: 429 }
      );
    }
    
    await connectDB();

    const body = await request.json();
    const { firstName, lastName, email, phone, password, confirmPassword } = body;

    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Production email domain check
    if (process.env.NODE_ENV === 'production') {
      const allowedDomains = process.env.ALLOWED_EMAIL_DOMAINS?.split(',').map(d => d.toLowerCase()) || [];
      if (allowedDomains.length > 0) {
        const emailDomain = email.split('@')[1].toLowerCase();
        if (!allowedDomains.includes(emailDomain)) {
          return NextResponse.json(
            { success: false, message: 'Email domain not allowed' },
            { status: 400 }
          );
        }
      }
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user with unverified email
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      isEmailVerified: false, // Require email verification
    });

    // Return user data (without password) - do not auto-login
    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    };

    const response = NextResponse.json(
      {
        success: true,
        message: 'Account created successfully. Please verify your email with the OTP sent to your inbox.',
        user: userResponse,
        requiresVerification: true,
      },
      { status: 201 }
    );
    
    // Do not set auth cookie - user must verify email first
    
    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Don't expose detailed error messages in production
    const errorMessage = process.env.NODE_ENV === 'production'
      ? 'Registration failed. Please try again.'
      : error.message || 'Registration failed';
    
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
