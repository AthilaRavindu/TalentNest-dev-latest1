
'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Head from 'next/head';
import { PasswordResetForm } from '../../../../components/employee/auth/PasswordResetForm';

const ResetPasswordPage: React.FC = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  
  // If userId is present, it's first-time login, otherwise it's forgot password
  const mode = userId ? 'first-time-login' : 'forgot-password';
  const pageTitle = mode === 'first-time-login' 
    ? 'Change Password - TalentNest' 
    : 'Reset Password - TalentNest';

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={
          mode === 'first-time-login' 
            ? 'Change your temporary password' 
            : 'Create your new password'
        } />
      </Head>
      <PasswordResetForm mode={mode} />
    </>
  );
};

export default ResetPasswordPage;