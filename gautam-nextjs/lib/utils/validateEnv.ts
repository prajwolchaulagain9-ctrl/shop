/**
 * Environment variable validation
 * This file should be imported early in the application lifecycle
 * to ensure all required environment variables are set
 */

interface EnvConfig {
  name: string;
  required: boolean;
  description: string;
}

const requiredEnvVars: EnvConfig[] = [
  {
    name: 'MONGODB_URI',
    required: true,
    description: 'MongoDB connection string',
  },
  {
    name: 'JWT_SECRET',
    required: true,
    description: 'Secret key for JWT token generation',
  },
  {
    name: 'GMAIL_USER',
    required: true,
    description: 'Gmail address used to send OTP emails (e.g. yourname@gmail.com)',
  },
  {
    name: 'GMAIL_APP_PASSWORD',
    required: true,
    description: 'Gmail App Password for sending emails (Google Account → Security → App Passwords)',
  },
  {
    name: 'ESEWA_MERCHANT_CODE',
    required: false, // Optional - only needed if using eSewa
    description: 'eSewa merchant code for payment processing',
  },
  {
    name: 'KHALTI_SECRET_KEY',
    required: false, // Optional - only needed if using Khalti
    description: 'Khalti secret key for payment processing',
  },
  {
    name: 'NEXT_PUBLIC_BASE_URL',
    required: true,
    description: 'Base URL of the application (for payment callbacks)',
  },
];

export function validateEnvironment(): void {
  const missingVars: string[] = [];
  const warnings: string[] = [];

  for (const config of requiredEnvVars) {
    const value = process.env[config.name];

    if (!value) {
      if (config.required) {
        missingVars.push(`${config.name} - ${config.description}`);
      } else {
        warnings.push(`${config.name} is not set - ${config.description}`);
      }
    }
  }

  // Log warnings
  if (warnings.length > 0) {
    console.warn('⚠️  Optional environment variables not set:');
    warnings.forEach(warning => console.warn(`  - ${warning}`));
  }

  // Throw error for missing required vars
  if (missingVars.length > 0) {
    const errorMessage = [
      '❌ Required environment variables are missing:',
      ...missingVars.map(v => `  - ${v}`),
      '',
      'Please check your .env file and ensure all required variables are set.',
      'See .env.example for reference.',
    ].join('\n');

    throw new Error(errorMessage);
  }

  console.log('✅ Environment validation passed');
}

// Auto-validate when this module is imported (only in Node.js environment)
if (typeof window === 'undefined') {
  try {
    // Skip validation during build time
    if (process.env.NEXT_PHASE !== 'phase-production-build') {
      validateEnvironment();
    }
  } catch (error) {
    console.error(error);
    // Only throw in development to catch issues early
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PHASE !== 'phase-production-build') {
      throw error;
    }
  }
}
