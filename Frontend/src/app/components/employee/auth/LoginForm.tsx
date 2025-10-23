// src/components/auth/LoginForm.tsx
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, Shield, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../../../hooks/employee/useAuth';
import { LoginFormData } from '../../../types/employee/auth';
import { validateEmail } from '../../../utils/employee/validation';
import { TalentNestLogo, TalentNestText } from '../../navbar/Assets/index';

export const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  
  const { login, isLoading, error } = useAuth();

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const result = await login(formData);
    if (!result.success) {
      // Error is handled by the hook
    }
  };

  const handleChange = (field: keyof LoginFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'rememberMe' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Image/Brand Section */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-900">
        {/* Decorative circles */}
        <div className="absolute rounded-full top-20 left-20 w-72 h-72 bg-white/10 blur-3xl"></div>
        <div className="absolute rounded-full bottom-20 right-20 w-96 h-96 bg-teal-500/20 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          {/* Logo/Brand */}
          <div className="flex items-center mb-8">
            <div className="flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="ml-4 text-3xl font-bold">TalentNest</h2>
            </div>
            

          {/* Main Heading */}
          <h1 className="mb-6 text-5xl font-bold leading-tight">
            Welcome Back to<br />Your Workspace
          </h1>
          
          <p className="max-w-md mb-12 text-xl text-teal-100">
            Streamline your HR operations and manage your workforce efficiently with our comprehensive platform.
          </p>

          {/* Feature List */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/20">
                <ArrowRight className="w-5 h-5" />
              </div>
              <span className="text-lg">Employee Management</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/20">
                <ArrowRight className="w-5 h-5" />
              </div>
              <span className="text-lg">Attendance Tracking</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/20">
                <ArrowRight className="w-5 h-5" />
              </div>
              <span className="text-lg">Performance Analytics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
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
              Sign In
            </h2>
            <p className="text-gray-600">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 mb-6 border border-red-200 rounded-lg bg-red-50">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              label="Email Address"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange('email')}
              icon={<Mail className="w-5 h-5" />}
              error={errors.email}
              required
            />

            <Input
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="Enter your password"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange('rememberMe')}
                  className="w-4 h-4 text-teal-600 border-gray-300 rounded cursor-pointer focus:ring-teal-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">
                  Remember me
                </span>
              </label>
              
              <Link 
                href="/pages/employee/auth/forgot-password"
                className="text-sm font-medium text-teal-600 transition-colors hover:text-teal-700"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full h-12 text-base font-semibold"
            >
              Sign In
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Dont have an account?{' '}
              <span className="font-medium text-teal-600">
                Contact Administrator
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};