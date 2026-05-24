import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import OTP from '@/lib/models/OTP';
import { sendOTPEmail } from '@/lib/utils/email';
import { checkRateLimit, RateLimitPresets } from '@/lib/utils/rateLimit';
import bcryptjs from 'bcryptjs';

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Rate limiting: 3 OTPs per hour per email
    const rateLimitResult = checkRateLimit({
      identifier: email.toLowerCase(),
      namespace: 'send-otp',
      ...RateLimitPresets.SEND_OTP,
    });

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Too many OTP requests. Please try again in ${Math.ceil(rateLimitResult.resetIn! / 60)} minutes.`,
        },
        { status: 429 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Hash OTP before storing
    const hashedOtp = await bcryptjs.hash(otp, 10);

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email: email.toLowerCase() });

    // Save hashed OTP to database
    await OTP.create({
      email: email.toLowerCase(),
      otp: hashedOtp,
      expiresAt,
    });

    // Send OTP via Gmail SMTP
    await sendOTPEmail(email, otp);

    return NextResponse.json(
      {
        success: true,
        message: 'OTP sent to your email address',
        expiresIn: 600, // 10 minutes in seconds
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send OTP. Please try again.' },
      { status: 500 }
    );
  }
}
