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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, valid: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Use Abstract API for email validation (free tier available)
    const apiKey = process.env.ABSTRACT_API_KEY || 'f2d9e5c3f0a4b7c8e1d2f3a4b5c6d7e8';
    const response = await fetch(
      `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${encodeURIComponent(email)}`,
      { method: 'GET' }
    );

    if (!response.ok) {
      // Fallback to basic validation if API fails
      return NextResponse.json(
        { 
          success: true, 
          valid: emailRegex.test(email), 
          message: 'Email format is valid' 
        },
        { status: 200 }
      );
    }

    const data = await response.json();

    // Check if email is valid and deliverable
    const isValid = data.is_valid_format?.value && 
                   data.is_smtp_valid?.value && 
                   !data.is_disposable_email?.value;

    return NextResponse.json(
      {
        success: true,
        valid: isValid,
        format_valid: data.is_valid_format?.value,
        smtp_valid: data.is_smtp_valid?.value,
        deliverable: data.deliverability === 'DELIVERABLE',
        disposable: data.is_disposable_email?.value,
        message: isValid ? 'Email is valid' : 'Email may not be valid',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email verification error:', error);
    
    // Fallback to basic validation on error
    return NextResponse.json(
      { success: true, valid: true, message: 'Email validation passed basic checks' },
      { status: 200 }
    );
  }
}
