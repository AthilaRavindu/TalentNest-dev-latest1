// src/components/auth/PasswordResetForm.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Lock, Shield, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../../../hooks/employee/useAuth';
import { PasswordResetData } from '../../../types/employee/auth';
import { validatePassword, getPasswordStrength, getStrengthColor, getStrengthText } from '../../../utils/employee/validation';
import LoadingBackdrop from '../ui/LoadingBackdrop';
import { toast } from 'react-toastify';

interface PasswordResetFormProps {
  mode?: 'forgot-password' | 'first-time-login';
}

export const PasswordResetForm: React.FC<PasswordResetFormProps> = ({ mode = 'forgot-password' }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId'); // For first-time login
  
  const [formData, setFormData] = useState<PasswordResetData & { currentPassword?: string }>({
    password: '',
    confirmPassword: '',
    currentPassword: mode === 'first-time-login' ? '' : undefined
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<PasswordResetData & { currentPassword?: string }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { resetPassword, isLoading, error } = useAuth();

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthColor = getStrengthColor(passwordStrength);
  const strengthText = getStrengthText(passwordStrength);

  // Check if userId is present for first-time login mode
  useEffect(() => {
    if (mode === 'first-time-login' && !userId) {
      toast.error('Invalid session. Please login again.', {
        position: 'top-right',
        autoClose: 3000,
      });
      router.push('/pages/employee/auth/login');
    }
  }, [mode, userId, router]);

  const validateForm = (): boolean => {
    const newErrors: Partial<PasswordResetData & { currentPassword?: string }> = {};
    
    // Validate current password for first-time login
    if (mode === 'first-time-login' && !formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0];
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Check if new password is same as current for first-time login
    if (mode === 'first-time-login' && formData.currentPassword === formData.password) {
      newErrors.password = 'New password must be different from current password';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      if (mode === 'first-time-login') {
        // Use change-password API for first-time login
        const res = await fetch('http://localhost:5000/api/otp/change-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userId,
            currentPassword: formData.currentPassword,
            newPassword: formData.password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || 'Failed to change password', {
            position: 'top-right',
            autoClose: 3000,
          });
          
          if (data.message.includes('Current password')) {
            setErrors({ currentPassword: data.message });
          }
          setIsSubmitting(false);
          return;
        }

        toast.success('Password changed successfully! Redirecting to login...', {
          position: 'top-right',
          autoClose: 2000,
        });
        
        setTimeout(() => {
          router.push('/pages/employee/auth/login');
        }, 2000);

      } else {
        // Use forgot-password API for password reset
        const result = await resetPassword(formData);
        if (!result.success) {
          // Error is handled by the hook
        }
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Network error. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof (PasswordResetData & { currentPassword?: string })) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const pageTitle = mode === 'first-time-login' ? 'Change Password' : 'Create New Password';
  const pageDescription = mode === 'first-time-login' 
    ? 'Please change your temporary password to continue'
    : 'Your new password must be different from previously used passwords';

  return (
    <div className="flex min-h-screen">
      <LoadingBackdrop open={isLoading || isSubmitting} />
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
            {mode === 'first-time-login' ? 'First-Time Login' : 'Create a Strong Password'}
          </h1>
          
          <p className="max-w-md mx-auto mb-8 text-lg text-center text-teal-100">
            {mode === 'first-time-login' 
              ? 'For security, you must change your temporary password before accessing your account.'
              : 'Your new password should be unique and strong to keep your account secure.'}
          </p>

          {/* Security Tips */}
          <div className="max-w-md p-6 mx-auto space-y-3 bg-white/10 backdrop-blur-sm rounded-xl">
            <h3 className="mb-3 text-lg font-semibold">Password Tips:</h3>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Use a mix of letters, numbers, and symbols</span>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Avoid common words or patterns</span>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Make it at least 8 characters long</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center flex-1 px-6 py-12 bg-gray-50 lg:px-12">
        <div className="w-full max-w-md">
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
              {pageTitle}
            </h2>
            <p className="text-gray-600">
              {pageDescription}
            </p>
          </div>

          {/* Info Box for First-Time Login */}
          {mode === 'first-time-login' && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>First-time login:</strong> For security, you must create a new password before accessing your account.
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 mb-6 border border-red-200 rounded-lg bg-red-50">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password - Only for first-time login */}
            {mode === 'first-time-login' && (
              <Input
                type={showCurrentPassword ? 'text' : 'password'}
                label="Current Password (Temporary)"
                placeholder="Enter temporary password"
                value={formData.currentPassword || ''}
                onChange={handleChange('currentPassword')}
                icon={<Lock className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="text-gray-400 transition-colors hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
                error={errors.currentPassword}
                required
              />
            )}

            <div className="space-y-3">
              <Input
                type={showPassword ? 'text' : 'password'}
                label="New Password"
                placeholder="Enter new password"
                value={formData.password}
                onChange={handleChange('password')}
                icon={<Lock className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 transition-colors hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
                error={errors.password}
                required
              />
              
              {formData.password && (
                <div className="space-y-3">
                  {/* Password Strength Meter */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Password strength:</span>
                      <span className="font-semibold text-gray-900">
                        {strengthText}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
                      <div
                        className={`h-full transition-all duration-300 ${strengthColor}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <div className="p-4 space-y-2 border border-gray-200 rounded-lg bg-gray-50">
                    <p className="mb-2 text-xs font-semibold text-gray-700">Password requirements:</p>
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${formData.password.length >= 8 ? 'bg-teal-500' : 'bg-gray-300'}`}>
                          {formData.password.length >= 8 && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className={`text-xs ${formData.password.length >= 8 ? 'text-teal-700 font-medium' : 'text-gray-600'}`}>
                          At least 8 characters
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${/[A-Z]/.test(formData.password) ? 'bg-teal-500' : 'bg-gray-300'}`}>
                          {/[A-Z]/.test(formData.password) && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className={`text-xs ${/[A-Z]/.test(formData.password) ? 'text-teal-700 font-medium' : 'text-gray-600'}`}>
                          One uppercase letter
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${/[a-z]/.test(formData.password) ? 'bg-teal-500' : 'bg-gray-300'}`}>
                          {/[a-z]/.test(formData.password) && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className={`text-xs ${/[a-z]/.test(formData.password) ? 'text-teal-700 font-medium' : 'text-gray-600'}`}>
                          One lowercase letter
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${/[0-9]/.test(formData.password) ? 'bg-teal-500' : 'bg-gray-300'}`}>
                          {/[0-9]/.test(formData.password) && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className={`text-xs ${/[0-9]/.test(formData.password) ? 'text-teal-700 font-medium' : 'text-gray-600'}`}>
                          One number
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${/[^A-Za-z0-9]/.test(formData.password) ? 'bg-teal-500' : 'bg-gray-300'}`}>
                          {/[^A-Za-z0-9]/.test(formData.password) && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className={`text-xs ${/[^A-Za-z0-9]/.test(formData.password) ? 'text-teal-700 font-medium' : 'text-gray-600'}`}>
                          One special character
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              label="Confirm Password"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              icon={<Lock className="w-5 h-5" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 transition-colors hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
              error={errors.confirmPassword}
              required
            />

            <Button
              type="submit"
              isLoading={isLoading || isSubmitting}
              disabled={!formData.password || !formData.confirmPassword || (mode === 'first-time-login' && !formData.currentPassword)}
              className="w-full h-12 text-base font-semibold"
            >
              {mode === 'first-time-login' ? 'Change Password' : 'Update Password'}
            </Button>
          </form>

          {/* Security Note */}
          <div className="p-4 mt-6 border border-teal-100 rounded-lg bg-teal-50">
            <p className="text-xs text-center text-teal-800">
              <Lock className="inline w-3 h-3 mr-1" />
              Make sure to remember your new password. It will be required for future logins.
            </p>
          </div>

          {/* Footer - Only show for forgot password flow */}
          {mode === 'forgot-password' && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <Link 
                  href="/pages/employee/auth/login"
                  className="font-medium text-teal-600 transition-colors hover:text-teal-700"
                >
                  Back to Login
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};