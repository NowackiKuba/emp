import Navbar from '@/components/nav/Navbar';
import React, { ReactNode } from 'react';

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className='w-full h-screen flex flex-col'>
      <section className='w-full'>
        <Navbar />
      </section>
      <section className='w-full h-full px-3 md:px-12 mt-4'>{children}</section>
    </main>
  );
};

export default AuthLayout;
