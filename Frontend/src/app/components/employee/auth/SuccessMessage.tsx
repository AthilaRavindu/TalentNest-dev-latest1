// src/components/auth/SuccessMessage.tsx
import React from 'react';
import Link from 'next/link';
import { CheckCircle, Shield, Lock, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export const SuccessMessage: React.FC = () => {
  return (
    <div className="flex min-h-screen">
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

          <div className="flex items-center justify-center w-32 h-32 mx-auto mb-8 rounded-full bg-white/20 backdrop-blur-sm">
            <CheckCircle className="w-16 h-16 text-white" />
          </div>

          <h1 className="mb-4 text-4xl font-bold text-center">
            All Set!
          </h1>
          
          <p className="max-w-md mx-auto mb-8 text-lg text-center text-teal-100">
            Your password has been successfully updated. Your account is now secure with your new credentials.
          </p>

          {/* Success Features */}
          <div className="max-w-md p-6 mx-auto space-y-3 bg-white/10 backdrop-blur-sm rounded-xl">
            <h3 className="mb-3 text-lg font-semibold">What's Next?</h3>
            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-6 h-6 bg-white/20 rounded-full flex-shrink-0 mt-0.5">
                <ArrowRight className="w-4 h-4" />
              </div>
              <span className="text-sm">Sign in with your new password</span>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-6 h-6 bg-white/20 rounded-full flex-shrink-0 mt-0.5">
                <ArrowRight className="w-4 h-4" />
              </div>
              <span className="text-sm">Access your account dashboard</span>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-6 h-6 bg-white/20 rounded-full flex-shrink-0 mt-0.5">
                <ArrowRight className="w-4 h-4" />
              </div>
              <span className="text-sm">Continue managing your HR tasks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Success Content */}
      <div className="flex items-center justify-center flex-1 px-6 py-12 bg-gray-50 lg:px-12">
        <div className="w-full max-w-md text-center">
          {/* Mobile Logo */}
          <div className="flex items-center justify-center mb-8 lg:hidden">
            <div className="flex items-center justify-center bg-teal-600 w-14 h-14 rounded-2xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="ml-3 text-2xl font-bold text-gray-900">TalentNest</h2>
          </div>

          {/* Success Icon */}
          <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-teal-100 rounded-full">
            <div className="flex items-center justify-center w-20 h-20 bg-teal-500 rounded-full">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </div>
          
          {/* Success Message */}
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            Password Reset Successful!
          </h1>
          
          <p className="max-w-sm mx-auto mb-8 text-gray-600">
            Your password has been successfully updated. You can now sign in with your new password and access your account.
          </p>
          
          {/* Action Button */}
          <Link href="/pages/employee/auth/login">
            <Button className="w-full h-12 mb-6 text-base font-semibold">
              Back to Login
            </Button>
          </Link>

          {/* Security Tips */}
          <div className="space-y-4">
            <div className="p-4 border border-teal-100 rounded-lg bg-teal-50">
              <div className="flex items-start space-x-3">
                <Lock className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="mb-1 text-sm font-semibold text-teal-900">
                    Security Tip
                  </p>
                  <p className="text-xs text-teal-700">
                    Keep your new password secure and don't share it with anyone. We recommend using a password manager for added security.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-100 border border-gray-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="mb-1 text-sm font-semibold text-gray-900">
                    Account Security
                  </p>
                  <p className="text-xs text-gray-600">
                    If you didn't request this password change, please contact your administrator immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Help */}
          <div className="pt-6 mt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Need help?{' '}
              <Link href="/support" className="font-medium text-teal-600 transition-colors hover:text-teal-700">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};