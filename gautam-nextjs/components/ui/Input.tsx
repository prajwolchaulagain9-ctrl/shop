'use client';

import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
  success?: boolean;
  helperText?: string;
  showPasswordToggle?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      success,
      helperText,
      showPasswordToggle,
      type = 'text',
      className = '',
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = showPasswordToggle && showPassword ? 'text' : type;

    const hasError = !!error;
    const hasSuccess = success && !hasError;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={`
              w-full px-4 py-3 border rounded-lg
              transition-all duration-200
              focus:outline-none focus:ring-2 
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${hasError 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                : hasSuccess
                ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                : 'border-gray-300 focus:border-red-500 focus:ring-red-200'
              }
              ${showPasswordToggle || hasError || hasSuccess ? 'pr-12' : 'pr-4'}
              ${className}
            `}
            {...props}
          />
          
          {/* Icon container */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {hasError && (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
            {hasSuccess && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
            {showPasswordToggle && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Error/Helper text */}
        <AnimatePresence>
          {(error || helperText) && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className={`mt-1 text-sm ${
                hasError ? 'text-red-600' : 'text-gray-500'
              }`}
            >
              {error || helperText}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
