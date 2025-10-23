
import React from 'react';
import Head from 'next/head';
import { LoginForm } from '../../../../components/employee/auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Login - HR Management System</title>
        <meta name="description" content="Sign in to your HR management account" />
      </Head>
      <LoginForm />
    </>
  );
};

export default LoginPage;