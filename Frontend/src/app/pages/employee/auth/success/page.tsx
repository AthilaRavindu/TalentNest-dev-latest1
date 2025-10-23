// src/pages/auth/success.tsx
import React from 'react';
import Head from 'next/head';
import { SuccessMessage } from '../../../../components/employee/auth/SuccessMessage';

const SuccessPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Success - HR Management System</title>
        <meta name="description" content="Password reset successful" />
      </Head>
      <SuccessMessage />
    </>
  );
};

export default SuccessPage;