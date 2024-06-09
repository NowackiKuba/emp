import { getCompanyById } from '@/actions/company.actions';
import Tasks from '@/components/pages/Tasks';
import React from 'react';

const page = async () => {
  return (
    <div className='w-full'>
      <Tasks />
    </div>
  );
};

export default page;
