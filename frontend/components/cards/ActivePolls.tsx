'use client';
import { usePolls } from '@/hooks/usePolls';
import React from 'react';
import PollCard from './PollCard';
import { format } from 'date-fns';

const ActivePolls = () => {
  const { polls, isLoading } = usePolls({
    startDate: format(new Date(), 'MM-dd-yyyy HH:mm'),
    endDate: '01-01-2200 00:00',
  });

  console.log(polls);
  return (
    <div className='w-full p-3 md:w-[calc(100%-384px)] bg-secondary rounded-xl h-80 flex flex-col items-start justify-start gap-2'>
      <p className='text-2xl font-semibold'>Active Polls</p>
      {!polls?.length && (
        <div className='flex items-center flex-col w-full justify-center gap-1 h-64'>
          <p className='text-lg font-semibold'>No Active Polls</p>
          <p className='text-gray-400'>Active Polls will show up here</p>
        </div>
      )}
      {polls?.map((p) => (
        <PollCard poll={p!} key={p.id} />
      ))}
    </div>
  );
};

export default ActivePolls;
