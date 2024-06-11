import { getCompanyPolls } from '@/actions/poll.actions';
import Polls from '@/components/pages/Polls';
import React from 'react';

const page = async () => {
  return (
    <div className='w-full'>
      <Polls />
    </div>
  );
};

export default page;
