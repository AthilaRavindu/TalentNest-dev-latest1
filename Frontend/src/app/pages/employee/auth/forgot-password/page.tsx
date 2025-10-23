// src/pages/auth/forgot-password.tsx
import React from 'react';
import Head from 'next/head';
import { ForgotPasswordForm } from '../../../../components/employee/auth/ForgotPasswordForm';

const ForgotPasswordPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Forgot Password - HR Management System</title>
        <meta name="description" content="Reset your password" />
      </Head>
      <ForgotPasswordForm />
    </>
  );
};

export default ForgotPasswordPage;