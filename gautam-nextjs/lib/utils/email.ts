import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendOTPEmail(to: string, otp: string): Promise<void> {
  await transporter.sendMail({
    from: `"Gautam Lady Shoes" <${process.env.GMAIL_USER}>`,
    to,
    subject: 'Your OTP for Gautam Lady Shoes Registration',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #8B0000 0%, #DC143C 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
          <h2 style="color: white; margin: 0; font-size: 24px;">Gautam Lady Shoes</h2>
          <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0 0; font-size: 14px;">Traditional Nepalese Craftsmanship</p>
        </div>
        <div style="background: #f8f9fa; padding: 40px; border-radius: 0 0 8px 8px;">
          <h3 style="color: #333; margin-top: 0; font-size: 20px;">Verify Your Email</h3>
          <p style="color: #666; font-size: 16px; margin: 20px 0;">
            Use this One-Time Password (OTP) to complete your registration:
          </p>
          <div style="background: white; border: 2px solid #8B0000; padding: 24px; text-align: center; border-radius: 8px; margin: 30px 0;">
            <h1 style="color: #8B0000; margin: 0; letter-spacing: 10px; font-size: 36px; font-weight: bold;">
              ${otp}
            </h1>
          </div>
          <p style="color: #666; font-size: 14px; margin: 20px 0;">
            This OTP will expire in <strong>10 minutes</strong>.
          </p>
          <p style="color: #999; font-size: 12px; margin: 20px 0;">
            If you didn't request this OTP, please ignore this email. Your account is safe.
          </p>
        </div>
        <div style="background: #333; padding: 20px; text-align: center; color: #999; font-size: 12px; border-radius: 0 0 8px 8px;">
          <p style="margin: 0;">© 2026 Gautam Lady Shoes, Machindranath, Kathmandu, Nepal.</p>
        </div>
      </div>
    `,
  });
}
