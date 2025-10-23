// src/pages/auth/verify-otp.tsx
import React from 'react';
import Head from 'next/head';
import { OTPVerification } from '../../../../components/employee/auth/OTPVerification';

const VerifyOTPPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Verify OTP - HR Management System</title>
        <meta name="description" content="Enter your verification code" />
      </Head>
      <OTPVerification />
    </>
  );
};

export default VerifyOTPPage;