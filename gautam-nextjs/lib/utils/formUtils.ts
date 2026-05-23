import { useEffect, useRef } from 'react';

export function useDebounce<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export function useAutoFocus(condition: boolean) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (condition && ref.current) {
      ref.current.focus();
    }
  }, [condition]);

  return ref;
}

// Validation utilities
export const validators = {
  email: (email: string): string | null => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return null;
  },

  password: (password: string): string | null => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (password.length > 128) return 'Password is too long';
    return null;
  },

  name: (name: string): string | null => {
    if (!name) return 'Name is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    if (name.length > 100) return 'Name is too long';
    return null;
  },

  phone: (phone: string): string | null => {
    if (!phone) return null; // Optional field
    const cleaned = phone.replace(/\s/g, '');
    if (!/^(\+977-?)?[0-9]{10}$/.test(cleaned)) {
      return 'Please enter a valid phone number (10 digits)';
    }
    return null;
  },

  required: (value: string, fieldName: string = 'This field'): string | null => {
    if (!value || !value.trim()) return `${fieldName} is required`;
    return null;
  },

  matchPassword: (password: string, confirmPassword: string): string | null => {
    if (password !== confirmPassword) return 'Passwords do not match';
    return null;
  },

  otp: (otp: string): string | null => {
    if (!otp) return 'OTP is required';
    if (!/^\d{6}$/.test(otp)) return 'OTP must be 6 digits';
    return null;
  },
};
