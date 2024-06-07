import SignInForm from '@/components/forms/SignInForm';
import SignUpForm from '@/components/forms/SignUpForm';
import React from 'react';

const page = () => {
  return (
    <div className='w-full h-full flex items-center justify-center'>
      <SignInForm />
    </div>
  );
};

export default page;
