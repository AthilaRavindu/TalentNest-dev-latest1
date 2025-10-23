// src/components/auth/OTPVerification.tsx
'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Mail, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../../../hooks/employee/useAuth';
import { useTimer } from '../../../../hooks/employee/useTimer';
import LoadingBackdrop from '../ui/LoadingBackdrop';

export const OTPVerification: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { verifyOTP, resendOTP, isLoading, error: authError } = useAuth();
  const { time, isActive, start, formatTime } = useTimer();

  // Get email from session storage
  const [email, setEmail] = useState('');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedEmail = document.cookie.split('; ').find(row => row.startsWith('reset_email='))?.split('=')[1] || '';
      setEmail(storedEmail);
    }
    
    // Start timer on mount
    start(300); // 5 minutes
  }, [start]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError('');

      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
    setOtp(newOtp);
    
    // Focus the last filled input or next empty one
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    const result = await verifyOTP(otpString);
    if (!result.success) {
      setError(result.error || 'Invalid OTP. Please try again.');
    }
  };

  const handleResendOTP = async () => {
    const result = await resendOTP();
    if (result.success) {
      setOtp(['', '', '', '', '', '']);
      start(300); // Restart timer
      setError('');
    }
  };

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
            <Lock className="w-12 h-12 text-white" />
          </div>

          <h1 className="mb-4 text-4xl font-bold text-center">
            Verify Your Identity
          </h1>
          
          <p className="max-w-md mx-auto mb-8 text-lg text-center text-teal-100">
            We've sent a 6-digit verification code to your email address. Please enter it below to continue.
          </p>

          <div className="max-w-md p-6 mx-auto bg-white/10 backdrop-blur-sm rounded-xl">
            <div className="flex items-center mb-3 space-x-3">
              <Mail className="w-5 h-5" />
              <span className="text-sm font-medium">Sent to:</span>
            </div>
            <p className="text-lg font-semibold">{email || 'your email'}</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center flex-1 px-6 py-12 bg-gray-50 lg:px-12">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link 
            href="/auth/forgot-password"
            className="inline-flex items-center mb-8 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
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
              Enter Verification Code
            </h2>
            <p className="text-gray-600">
              We sent a 6-digit code to{' '}
              <span className="font-semibold text-gray-900">{email || 'your email'}</span>
            </p>
          </div>

          {/* Error Message */}
          {(error || authError) && (
            <div className="p-4 mb-6 border border-red-200 rounded-lg bg-red-50">
              <p className="text-sm text-red-600">{error || authError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-4 text-sm font-medium text-gray-700">
                6-Digit Code
              </label>
              <div className="flex justify-between gap-2" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={e => handleOtpChange(index, e.target.value)}
                    onKeyDown={e => handleKeyDown(index, e)}
                    className="w-full text-2xl font-bold text-center text-gray-600 transition duration-200 border-2 border-gray-300 rounded-lg h-14 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 hover:border-gray-400"
                    maxLength={1}
                  />
                ))}
              </div>
            </div>

            {/* Timer/Resend Section */}
            <div className="flex items-center justify-center p-4 bg-gray-100 rounded-lg">
              {isActive && time > 0 ? (
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Code expires in <span className="font-semibold text-gray-900">{formatTime()}</span></span>
                </div>
              ) : (
                <div className="text-center">
                  <p className="mb-2 text-sm text-gray-600">Didn't receive the code?</p>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="text-sm font-semibold text-teal-600 transition-colors hover:text-teal-700"
                    disabled={isLoading}
                  >
                    Resend Verification Code
                  </button>
                </div>
              )}
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              disabled={otp.some(digit => !digit)}
              className="w-full h-12 text-base font-semibold"
            >
              Verify Code
            </Button>
          </form>

          {/* Security Note */}
          <div className="p-4 mt-6 border border-teal-100 rounded-lg bg-teal-50">
            <p className="text-xs text-center text-teal-800">
              <Lock className="inline w-3 h-3 mr-1" />
              For your security, this code will expire in 5 minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};