import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testEmail } = body;

    if (!testEmail) {
      return NextResponse.json(
        { success: false, message: 'Test email is required' },
        { status: 400 }
      );
    }

    console.log('Email credentials:', {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD ? '***HIDDEN***' : 'NOT SET',
    });

    // Test transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp-relay.brevo.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    console.log('Verifying transporter...');
    await transporter.verify();
    console.log('Transporter verified successfully!');

    console.log('Sending test email to:', testEmail);
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: testEmail,
      subject: 'Test Email from Gautam Lady Shoes',
      text: 'If you receive this, email configuration is working!',
      html: '<h1>Email Configuration Test</h1><p>If you receive this, email configuration is working!</p>',
    });

    console.log('Email sent:', result);

    return NextResponse.json(
      {
        success: true,
        message: 'Test email sent successfully!',
        details: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Test email error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to send test email',
        error: error.toString(),
      },
      { status: 500 }
    );
  }
}
