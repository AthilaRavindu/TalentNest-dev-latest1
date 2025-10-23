// src/hooks/useAuth.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginFormData, ForgotPasswordData, PasswordResetData, ApiResponse } from '@/app/types/employee/auth';
import { toast } from 'react-toastify';

interface User {
  id?: string;
  _id?: string;
  userId?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  NIC?: string;
  workEmail?: string;
  personalPhoneNumber?: string;
  whatsappPhoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  maritalStatus?: string;
  nationality?: string;
  passportNumber?: string;
  bloodGroup?: string;
  religion?: string;
  currentAddress?: string;
  permanentAddress?: string;
  socialMediaLinks?: any;
  department?: string;
  position?: string;
  managerId?: string;
  workLocation?: string;
  employmentType?: string;
  employmentStatus?: string;
  hireDate?: string;
  terminationDate?: string;
  workingHours?: string;
  basicSalary?: number;
  emergencyContact?: any;
  createdAt?: string;
  updatedAt?: string;
}

interface LoginResponse extends ApiResponse {
  forcePasswordChange?: boolean;
  userId?: string;
  employeeId?: string;
  token?: string;
  user?: User;
}
    

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = async (data: LoginFormData): Promise<ApiResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("🔐 Attempting login for:", data.email);

      const response = await fetch('http://localhost:5000/api/otp/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.email,
          password: data.password,
        }),
      });

      const result: LoginResponse = await response.json();

      if (response.ok) {
        // Check if password change is required
        if (result.forcePasswordChange) {
          console.log("🔄 Password change required for user:", data.email);
    
          toast.success('Login successful! Please change your password to continue.', {
            position: 'top-right',
            autoClose: 3000,
          });
          
          setTimeout(() => {
            router.push(`/pages/employee/auth/reset-password?userId=${result.userId}`);
          }, 1500);
          
          setIsLoading(false);
          return { success: true, data: result };
        }

        // ✅ Login successful
        console.log("✅ Login successful, storing user data...");
        console.log("📦 Full API Response:", result);
        console.log("👤 User object:", result.user);
        
        if (typeof window !== 'undefined') {
          // Store MongoDB id
          const mongoId = result.user?.id;
          if (mongoId) {
            localStorage.setItem('mongoId', mongoId);
            sessionStorage.setItem('mongoId', mongoId);
            console.log('✅ Stored MongoDB id:', mongoId);
          } else {
            console.error('❌ No MongoDB id found in response!');
            console.error('📋 API Response:', JSON.stringify(result, null, 2));
          }

          // Store userId
          const userIdToStore = result.user?.userId || result.userId;
          
          if (userIdToStore) {
            localStorage.setItem('userId', userIdToStore);
            sessionStorage.setItem('userId', userIdToStore);
            console.log('✅ Stored userId in storage:', userIdToStore);
          } else {
            console.error('❌ No valid userId found in response!');
          }

          // Store token if available
          if (result.token) {
            localStorage.setItem('token', result.token);
            sessionStorage.setItem('token', result.token);
            console.log('✅ Stored token in storage');
          }

          // Store full user object
          if (result.user) {
            const userData = {
              id: result.user.id,
              userId: result.user.userId,
              username: result.user.username,
              fullName: result.user.fullName,
              workEmail: result.user.workEmail,
              firstName: result.user.firstName,
              lastName: result.user.lastName,
              department: result.user.department,
              position: result.user.position,
              workLocation: result.user.workLocation,
              employmentStatus: result.user.employmentStatus,
            };

            if (data.rememberMe && result.token) {
              document.cookie = `auth_token=${result.token}; path=/; max-age=${60 * 60 * 24 * 30}`;
              document.cookie = `mongoId=${mongoId}; path=/; max-age=${60 * 60 * 24 * 30}`;
              localStorage.setItem('user', JSON.stringify(userData));
              localStorage.setItem('isAuthenticated', 'true');
            } else {
              sessionStorage.setItem('user', JSON.stringify(userData));
              sessionStorage.setItem('isAuthenticated', 'true');
            }
            
            console.log('✅ Stored user data:', userData);
            console.log('📋 Position stored:', userData.position);
          }
        }
        
        toast.success('Login successful! Welcome back.', {
          position: 'top-right',
          autoClose: 2000,
        });

        setTimeout(() => {
          router.push('/pages/employee/employee_dashboard');
        }, 1000);
        
        return { success: true, data: result };
      } else {
        const errorMessage = result.message || 'Login failed';
        setError(errorMessage);
        toast.error(errorMessage, {
          position: 'top-right',
          autoClose: 3000,
        });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      const errorMessage = 'Network error. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (data: ForgotPasswordData): Promise<ApiResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password/send-otp-mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('Forgot Password Response:', response);
      const result = await response.json();
      console.log('Forgot Password Response:', result);

      if (response.ok) {
        if (typeof window !== 'undefined') {
          document.cookie = `reset_email=${data.email}; path=/; max-age=${60 * 15}`;
        }
        
        toast.success('OTP sent to your email! Redirecting to OTP verification...', {
          position: 'top-right',
          autoClose: 5000,
        });
        
        setTimeout(() => {
          router.push('/pages/employee/auth/verify-otp');
        }, 6000);

        return { success: true, data: result };
      } else {
        setError(result.message || 'Failed to send reset email');
        return { success: false, error: result.message };
      }
    } catch (error) {
      const errorMessage = 'Network error. Please try again.';
      setError(errorMessage);
      console.log(error);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (otp: string): Promise<ApiResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const email = typeof window !== 'undefined' 
        ? document.cookie.split('; ').find(row => row.startsWith('reset_email='))?.split('=')[1]
        : null;
      
      const response = await fetch('http://localhost:5000/api/auth/forgot-password/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const result = await response.json();

      if (response.ok) {
        if (typeof window !== 'undefined') {
          document.cookie = `reset_token=${result.resetToken}; path=/; max-age=${60 * 15}`;
        }
        
        toast.success('OTP verified! Redirecting to reset password...', {
          position: 'top-right',
          autoClose: 5000,
        });

        setTimeout(() => {
          router.push('/pages/employee/auth/reset-password');
          setIsLoading(false);
        }, 2500);
        
        return { success: true, data: result };
      } else {
        setError(result.message || 'Invalid OTP');
        return { success: false, error: result.message };
      }
    } catch (error) {
      const errorMessage = 'Network error. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2500);
    }
  };

  const resetPassword = async (data: PasswordResetData): Promise<ApiResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const resetToken = typeof window !== 'undefined'
        ? document.cookie.split('; ').find(row => row.startsWith('reset_token='))?.split('=')[1]
        : null;

      if (!resetToken) {
        setError('No reset token found');
        return { success: false, error: 'No reset token found' };
      }
      
      const email = typeof window !== 'undefined' 
        ? document.cookie.split('; ').find(row => row.startsWith('reset_email='))?.split('=')[1]
        : null;

      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          newPassword: data.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        if (typeof window !== 'undefined') {
          document.cookie = 'reset_email=; path=/; max-age=0';
          document.cookie = 'reset_token=; path=/; max-age=0';
        }

        toast.success('Password reset successful! Redirecting to login...', {
          position: 'top-right',
          autoClose: 3000,
        });
        
        setTimeout(() => {
          router.push('/pages/employee/auth/login');
          setIsLoading(false);
        }, 2500);

        return { success: true, data: result };
      } else {
        setError(result.message || 'Failed to reset password');
        return { success: false, error: result.message };
      }
    } catch (error) {
      const errorMessage = 'Network error. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2500);
    }
  };

  const resendOTP = async (): Promise<ApiResponse> => {
    const email = typeof window !== 'undefined'
      ? document.cookie.split('; ').find(row => row.startsWith('reset_email='))?.split('=')[1]
      : null;
      
    if (!email) {
      return { success: false, error: 'No email found' };
    }
    
    return forgotPassword({ email });
  };

  return {
    login,
    forgotPassword,
    verifyOTP,
    resetPassword,
    resendOTP,
    isLoading,
    error,
    clearError: () => setError(null)
  };
};