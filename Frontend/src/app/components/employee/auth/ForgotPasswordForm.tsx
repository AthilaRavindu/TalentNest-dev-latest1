// src/components/auth/ForgotPasswordForm.tsx
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Shield, Lock, Key } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../../../hooks/employee/useAuth';
import { ForgotPasswordData } from '../../../types/employee/auth';
import { validateEmail } from '../../../utils/employee/validation';
import LoadingBackdrop from '../ui/LoadingBackdrop';

export const ForgotPasswordForm: React.FC = () => {
  const [formData, setFormData] = useState<ForgotPasswordData>({
    email: ''
  });
  const [errors, setErrors] = useState<Partial<ForgotPasswordData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { forgotPassword, isLoading, error } = useAuth();

  const validateForm = (): boolean => {
    const newErrors: Partial<ForgotPasswordData> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const result = await forgotPassword(formData);
    if (result.success) {
      setIsSubmitted(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ email: e.target.value });
    
    // Clear error when user starts typing
    if (errors.email) {
      setErrors({});
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen">
        {/* Left Side - Brand Section */}
        <div className="relative hidden overflow-hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-900">
          <div className="absolute rounded-full top-20 left-20 w-72 h-72 bg-white/10 blur-3xl"></div>
          <div className="absolute rounded-full bottom-20 right-20 w-96 h-96 bg-teal-500/20 blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col justify-center px-16 text-white">
            <div className="flex items-center mb-8">
              <div className="flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="ml-4 text-3xl font-bold">TalentNest</h2>
            </div>

            <div className="flex items-center justify-center w-24 h-24 mx-auto mb-8 rounded-full bg-white/20 backdrop-blur-sm">
              <Mail className="w-12 h-12 text-white" />
            </div>

            <h1 className="mb-4 text-4xl font-bold text-center">
              Check Your Inbox
            </h1>
            
            <p className="max-w-md mx-auto text-lg text-center text-teal-100">
              We've sent you instructions to reset your password. Please check your email.
            </p>
          </div>
        </div>

        {/* Right Side - Success Message */}
        <div className="flex items-center justify-center flex-1 px-6 py-12 bg-gray-50 lg:px-12">
          <div className="w-full max-w-md text-center">
            {/* Mobile Logo */}
            <div className="flex items-center justify-center mb-8 lg:hidden">
              <div className="flex items-center justify-center bg-teal-600 w-14 h-14 rounded-2xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="ml-3 text-2xl font-bold text-gray-900">TalentNest</h2>
            </div>

            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-teal-100 rounded-full">
              <Mail className="w-10 h-10 text-teal-600" />
            </div>

            <h1 className="mb-4 text-3xl font-bold text-gray-900">Check Your Email</h1>
            
            <p className="mb-2 text-gray-600">
              We've sent a verification code to
            </p>
            <p className="mb-8 text-lg font-semibold text-gray-900">
              {formData.email}
            </p>

            <Link 
              href="/auth/verify-otp"
              className="inline-block w-full px-6 py-3 mb-4 font-semibold text-center text-white transition-colors bg-teal-600 rounded-lg hover:bg-teal-700"
            >
              Continue to Verification
            </Link>

            <p className="mt-6 text-sm text-gray-600">
              Didn't receive the email?{' '}
              <button 
                onClick={handleSubmit}
                className="font-medium text-teal-600 hover:text-teal-700"
              >
                Resend
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <LoadingBackdrop open={isLoading} />
      {/* Left Side - Brand Section */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800">
        <div className="absolute rounded-full top-20 left-20 w-72 h-72 bg-white/10 blur-3xl"></div>
        <div className="absolute rounded-full bottom-20 right-20 w-96 h-96 bg-teal-500/20 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center mb-8">
            <div className="flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="ml-4 text-3xl font-bold">TalentNest</h2>
          </div>

          <div className="flex items-center justify-center w-24 h-24 mx-auto mb-8 rounded-full bg-white/20 backdrop-blur-sm">
            <Key className="w-12 h-12 text-white" />
          </div>

          <h1 className="mb-4 text-4xl font-bold text-center">
            Forgot Your Password?
          </h1>
          
          <p className="max-w-md mx-auto text-lg text-center text-teal-100">
            No worries! Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center flex-1 px-6 py-12 bg-gray-50 lg:px-12">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link 
            href="/pages/employee/auth/login"
            className="inline-flex items-center mb-8 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>

          {/* Mobile Logo */}
          <div className="flex items-center justify-center mb-8 lg:hidden">
            <div className="flex items-center justify-center bg-teal-600 w-14 h-14 rounded-2xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="ml-3 text-2xl font-bold text-gray-900">TalentNest</h2>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-bold text-gray-900">
              Reset Password
            </h2>
            <p className="text-gray-600">
              Enter your email address and we'll send you a verification code
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 mb-6 border border-red-200 rounded-lg bg-red-50">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              label="Email Address"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              icon={<Mail className="w-5 h-5" />}
              error={errors.email}
              required
            />

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full h-12 text-base font-semibold"
            >
              Send Verification Code
            </Button>
          </form>

          {/* Footer Note */}
          <div className="p-4 mt-8 border border-teal-100 rounded-lg bg-teal-50">
            <p className="text-sm text-teal-800">
              <Lock className="inline w-4 h-4 mr-2" />
              For security reasons, the code will expire in 15 minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};