import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import OTP from '@/lib/models/OTP';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email: email.toLowerCase() });

    // Save OTP to database
    await OTP.create({
      email: email.toLowerCase(),
      otp,
      expiresAt,
    });

    // Send OTP via Resend
    try {
      console.log('Attempting to send OTP via Resend to:', email);
      
      // For development/testing: Allow OTP to be generated even if email sending fails
      // In production, verify a domain at resend.com/domains and use that domain's email
      const result = await resend.emails.send({
        from: 'onboarding@resend.dev', // Using resend's default domain
        to: email,
        subject: 'Your OTP for Gautam Lady Shoes Registration',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #8B0000 0%, #DC143C 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
              <h2 style="color: white; margin: 0;">Gautam Lady Shoes</h2>
            </div>
            <div style="background: #f8f9fa; padding: 40px; border-radius: 0 0 8px 8px;">
              <h3 style="color: #333; margin-top: 0;">Verify Your Email</h3>
              <p style="color: #666; font-size: 16px; margin: 20px 0;">
                Use this One-Time Password (OTP) to complete your registration:
              </p>
              <div style="background: white; border: 2px solid #8B0000; padding: 20px; text-align: center; border-radius: 8px; margin: 30px 0;">
                <h1 style="color: #8B0000; margin: 0; letter-spacing: 5px; font-size: 32px; font-weight: bold;">
                  ${otp}
                </h1>
              </div>
              <p style="color: #666; font-size: 14px; margin: 20px 0;">
                This OTP will expire in <strong>10 minutes</strong>.
              </p>
              <p style="color: #999; font-size: 12px; margin: 20px 0;">
                If you didn't request this OTP, please ignore this email.
              </p>
            </div>
            <div style="background: #333; padding: 20px; text-align: center; color: #999; font-size: 12px; border-radius: 0 0 8px 8px;">
              <p style="margin: 0;">© 2026 Gautam Lady Shoes. All rights reserved.</p>
            </div>
          </div>
        `,
      });

      // Log the result but continue with registration even if email fails during development
      if (result.error) {
        console.warn('Resend email warning (OTP still saved to DB):', result.error.message);
        // In development, allow registration to continue even if email can't be sent
        // In production, you should change this to properly fail
        console.log('Note: OTP has been generated and saved. To deliver emails, verify a domain at resend.com/domains');
      } else {
        console.log('OTP sent successfully via Resend! ID:', result.data?.id);
      }
    } catch (emailError: any) {
      console.error('Email sending error:', emailError);
      // In development, still allow OTP verification to proceed
      // The OTP is already saved in the database
      console.warn('Email delivery failed but OTP was generated. Continuing with registration...');
    }

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
      { success: false, message: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}
