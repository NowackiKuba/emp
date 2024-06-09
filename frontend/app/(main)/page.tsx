import { Test } from '@/actions/user.actions';
import Dashboard from '@/components/pages/Dashboard';
import React from 'react';

const page = async () => {
  const { companyId, email, userId } = await Test();
  console.log(companyId, email, userId);
  return (
    <div>
      <Dashboard />
    </div>
  );
};

export default page;
