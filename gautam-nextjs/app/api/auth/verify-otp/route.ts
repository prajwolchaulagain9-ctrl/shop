import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import OTP from '@/lib/models/OTP';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
    });

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, message: 'OTP not found. Please request a new one.' },
        { status: 404 }
      );
    }

    // Check if OTP has expired
    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        { success: false, message: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Check attempts
    if (otpRecord.attempts >= 5) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        { success: false, message: 'Too many failed attempts. Please request a new OTP.' },
        { status: 429 }
      );
    }

    // Verify OTP
    if (otpRecord.otp !== otp.trim()) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return NextResponse.json(
        {
          success: false,
          message: `Invalid OTP. ${5 - otpRecord.attempts} attempts remaining.`,
          attemptsRemaining: 5 - otpRecord.attempts,
        },
        { status: 400 }
      );
    }

    // OTP verified successfully
    otpRecord.verified = true;
    await otpRecord.save();

    return NextResponse.json(
      {
        success: true,
        message: 'OTP verified successfully',
        verified: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}
