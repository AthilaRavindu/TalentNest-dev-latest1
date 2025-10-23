"use client";
import { useState, useEffect } from "react";
import { Edit2, Lock, Eye, EyeOff, Loader2, Mail, Shield, Check } from "lucide-react";
import { toast } from "react-hot-toast";

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  workEmail: string;
  personalPhoneNumber: string;
  currentAddress: {
    addressLine: string;
    city: string;
    province: string;
    postalCode: string;
  };
  emergencyContact: {
    name: string;
    phoneNumber: string;
    relationship: string;
  };
}

export default function PersonalInfo() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);
  const [verifyingOTP, setVerifyingOTP] = useState(false);

  // Password security states
  const [isPasswordSectionLocked, setIsPasswordSectionLocked] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);

  // User data fields
  const [mongoId, setMongoId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyRelation, setEmergencyRelation] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // OTP Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      const storedMongoId = localStorage.getItem('mongoId') || sessionStorage.getItem('mongoId');
      
      if (!storedMongoId) {
        toast.error('User not logged in. Please login again.');
        console.error('❌ No mongoId found in storage');
        return;
      }

      console.log('🔍 Fetching user data with mongoId:', storedMongoId);
      setMongoId(storedMongoId);

      const response = await fetch(`http://localhost:5000/api/users/${storedMongoId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.status}`);
      }

      const result = await response.json();
      const data: UserData = result.data;
      
      console.log('✅ User data received:', data);
      
      setName(data.fullName || `${data.firstName} ${data.lastName}`);
      setEmail(data.workEmail);
      setPhone(data.personalPhoneNumber || '');
      setAddress(data.currentAddress?.addressLine || '');
      setCity(data.currentAddress?.city || '');
      setProvince(data.currentAddress?.province || '');
      setPostalCode(data.currentAddress?.postalCode || '');
      setEmergencyName(data.emergencyContact?.name || '');
      setEmergencyRelation(data.emergencyContact?.relationship || '');
      setEmergencyContact(data.emergencyContact?.phoneNumber || '');

      console.log('✅ User data loaded successfully');
    } catch (error) {
      console.error('❌ Error fetching user data:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePersonalInfo = async () => {
    try {
      setSaving(true);

      if (!mongoId) {
        toast.error('User ID not found');
        return;
      }

      const updateData = {
        personalPhoneNumber: phone,
        currentAddress: {
          addressLine: address,
          city: city,
          province: province,
          postalCode: postalCode,
        },
        emergencyContact: {
          name: emergencyName,
          phoneNumber: emergencyContact,
          relationship: emergencyRelation,
        },
      };

      console.log('📤 Sending update with data:', updateData);

      const response = await fetch(`http://localhost:5000/api/users/${mongoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user data');
      }

      toast.success('Personal information updated successfully!');
      console.log('✅ Personal info updated');
    } catch (error) {
      console.error('❌ Error updating personal info:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update personal information');
    } finally {
      setSaving(false);
    }
  };

  const handleSendOTP = async () => {
    try {
      setSendingOTP(true);

      if (!email) {
        toast.error('Email not found');
        return;
      }

      console.log('📧 Sending OTP to:', email);

      const response = await fetch('http://localhost:5000/api/auth/forgot-password/send-otp-mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        setOtpSent(true);
        setTimer(300); // 5 minutes
        toast.success('OTP sent to your email! Please check your inbox.');
        console.log('✅ OTP sent successfully');
      } else {
        throw new Error(result.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('❌ Error sending OTP:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send OTP');
    } finally {
      setSendingOTP(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setVerifyingOTP(true);

      if (!otp || otp.length !== 6) {
        toast.error('Please enter a valid 6-digit OTP');
        return;
      }

      console.log('🔐 Verifying OTP...');

      const response = await fetch('http://localhost:5000/api/auth/forgot-password/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const result = await response.json();

      if (response.ok) {
        setOtpVerified(true);
        setIsPasswordSectionLocked(false);
        toast.success('Verification successful! You can now change your password.');
        console.log('✅ OTP verified successfully');
      } else {
        throw new Error(result.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('❌ Error verifying OTP:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to verify OTP');
    } finally {
      setVerifyingOTP(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      if (!otpVerified) {
        toast.error('Please verify your email first');
        return;
      }

      if (!newPassword || !confirmPassword) {
        toast.error('Please fill all password fields');
        return;
      }

      if (newPassword !== confirmPassword) {
        toast.error('New passwords do not match');
        return;
      }

      if (newPassword.length < 6) {
        toast.error('Password must be at least 6 characters long');
        return;
      }

      setChangingPassword(true);

      if (!mongoId) {
        toast.error('User ID not found');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/users/${mongoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to change password');
      }

      toast.success('Password changed successfully!');
      
      // Reset all password-related states
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setOtp('');
      setOtpSent(false);
      setOtpVerified(false);
      setIsPasswordSectionLocked(true);
      setTimer(0);
      
      console.log('✅ Password changed successfully');
    } catch (error) {
      console.error('❌ Error changing password:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleResendOTP = () => {
    if (timer > 0) {
      toast.error(`Please wait ${timer} seconds before resending`);
      return;
    }
    handleSendOTP();
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, text: "" };
    if (password.length < 6) return { strength: 33, text: "Weak" };
    if (password.length < 10) return { strength: 66, text: "Medium" };
    return { strength: 100, text: "Strong" };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Card - Personal Information */}
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
            <div className="space-y-5">
              {/* Name Field (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    readOnly
                    className="w-full border border-gray-200 p-3 pr-12 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed shadow-md"
                  />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Contact admin to change name</p>
              </div>

              {/* Email Field (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="w-full border border-gray-200 p-3 pr-12 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed shadow-md"
                  />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Contact admin to change email</p>
              </div>

              {/* Phone Number Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full border border-gray-200 p-3 pr-12 rounded-lg focus:outline-none focus:border-teal-500 text-gray-900 shadow-md"
                  />
                  <Edit2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-600" />
                </div>
              </div>

              {/* Address Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <div className="relative mb-3">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter address line"
                    className="w-full border border-gray-200 p-3 pr-12 rounded-lg focus:outline-none focus:border-teal-500 text-gray-900 shadow-md"
                  />
                  <Edit2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-600" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className="w-full border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:border-teal-500 text-sm text-gray-900 shadow-md"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      placeholder="Province"
                      className="w-full border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:border-teal-500 text-sm text-gray-900 shadow-md"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="Postal Code"
                      className="w-full border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:border-teal-500 text-sm text-gray-900 shadow-md"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact Section */}
              <div className="pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Emergency Contact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={emergencyName}
                        onChange={(e) => setEmergencyName(e.target.value)}
                        placeholder="Name"
                        className="w-full border border-gray-200 p-2.5 pr-9 rounded-lg focus:outline-none focus:border-teal-500 text-sm text-gray-900 shadow-md"
                      />
                      <Edit2 className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-600" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Relationship
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={emergencyRelation}
                        onChange={(e) => setEmergencyRelation(e.target.value)}
                        placeholder="Relationship"
                        className="w-full border border-gray-200 p-2.5 pr-9 rounded-lg focus:outline-none focus:border-teal-500 text-sm text-gray-900 shadow-md"
                      />
                      <Edit2 className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-600" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Contact Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={emergencyContact}
                        onChange={(e) => setEmergencyContact(e.target.value)}
                        placeholder="Contact number"
                        className="w-full border border-gray-200 p-2.5 pr-9 rounded-lg focus:outline-none focus:border-teal-500 text-sm text-gray-900 shadow-md"
                      />
                      <Edit2 className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <button 
                onClick={handleSavePersonalInfo}
                disabled={saving}
                className="w-full mt-6 bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>

          {/* Right Card - Secure Password Change */}
          <div className="bg-white p-8 rounded-2xl shadow-sm relative">
            {/* Blur overlay when locked */}
            {isPasswordSectionLocked && (
              <div className="absolute inset-0 backdrop-blur-sm bg-white/30 rounded-2xl z-10 flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-teal-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Password Change</h3>
                    <p className="text-sm text-gray-600">
                      For your security, we need to verify your identity before allowing password changes.
                    </p>
                  </div>

                  {!otpSent ? (
                    <div className="space-y-4">
                      <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Mail className="w-5 h-5 text-teal-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-teal-900">Verification Email</p>
                            <p className="text-xs text-teal-700 mt-1">
                              We ll send a verification code to: <span className="font-semibold">{email}</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleSendOTP}
                        disabled={sendingOTP}
                        className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {sendingOTP ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Sending OTP...
                          </>
                        ) : (
                          <>
                            <Mail className="w-5 h-5" />
                            Send Verification Code
                          </>
                        )}
                      </button>
                    </div>
                  ) : !otpVerified ? (
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-900">
                          A 6-digit code has been sent to <span className="font-semibold">{email}</span>
                        </p>
                        {timer > 0 && (
                          <p className="text-xs text-blue-700 mt-2">
                            Code expires in: <span className="font-semibold">{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Enter Verification Code
                        </label>
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="000000"
                          maxLength={6}
                          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-teal-500 text-center text-2xl tracking-widest font-semibold"
                        />
                      </div>

                      <button
                        onClick={handleVerifyOTP}
                        disabled={verifyingOTP || otp.length !== 6}
                        className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {verifyingOTP ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            <Check className="w-5 h-5" />
                            Verify Code
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleResendOTP}
                        disabled={timer > 0}
                        className="w-full text-teal-600 py-2 text-sm font-medium hover:text-teal-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        {timer > 0 ? `Resend code in ${timer}s` : 'Resend Code'}
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            )}

            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              Change Password
              {otpVerified && (
                <span className="inline-flex items-center gap-1 text-xs font-normal bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  <Check className="w-3 h-3" />
                  Verified
                </span>
              )}
            </h2>
            <div className="space-y-5">
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    disabled={!otpVerified}
                    className="w-full border border-gray-200 p-3 pr-12 rounded-lg focus:outline-none focus:border-teal-500 text-gray-900 shadow-md disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    disabled={!otpVerified}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {newPassword && otpVerified && (
                  <div className="mt-3">
                    <div className="flex gap-1 mb-1">
                      <div
                        className={`h-1 flex-1 rounded ${
                          passwordStrength.strength >= 33
                            ? "bg-teal-500"
                            : "bg-gray-200"
                        }`}
                      />
                      <div
                        className={`h-1 flex-1 rounded ${
                          passwordStrength.strength >= 66
                            ? "bg-teal-500"
                            : "bg-gray-200"
                        }`}
                      />
                      <div
                        className={`h-1 flex-1 rounded ${
                          passwordStrength.strength >= 100
                            ? "bg-teal-500"
                            : "bg-gray-200"
                        }`}
                      />
                    </div>
                    <p className="text-xs text-teal-600 text-right">
                      {passwordStrength.text}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    disabled={!otpVerified}
                    className="w-full border border-gray-200 p-3 pr-12 rounded-lg focus:outline-none focus:border-teal-500 text-gray-900 shadow-md disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={!otpVerified}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Change Password Button */}
              <button 
                onClick={handleChangePassword}
                disabled={changingPassword || !otpVerified}
                className="w-full mt-6 bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {changingPassword ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  'Change Password'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}