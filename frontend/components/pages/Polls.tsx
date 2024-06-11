'use client';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { BarChart, CirclePlus } from 'lucide-react';
import CreatePoll from '../dialogs/CreatePoll';
import { usePolls } from '@/hooks/usePolls';
import PollCard from '../cards/PollCard';

const Polls = () => {
  const [isOpenCreate, setIsOpenCreate] = useState<boolean>(false);
  const { polls, isLoading } = usePolls();
  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className='flex items-center justify-between w-full'>
        <p className='text-2xl font-semibold'>Polls</p>
        <Button
          className='flex items-center gap-2'
          onClick={() => setIsOpenCreate(true)}
        >
          <CirclePlus />
          <p>Create Poll</p>
        </Button>
      </div>
      <div className='flex items-center gap-2 w-full'>
        <div className='h-80 w-80 py-2 rounded-xl bg-secondary flex items-center justify-center flex-col gap-2 px-4'>
          <div className='h-40 w-40 bg-primary/10 rounded-full text-primary dark:bg-red-500/20 dark:text-red-200 flex items-center justify-center'>
            <BarChart className='h-20 w-20' />
          </div>
          <div className='flex items-center gap-3'>
            <p className='text-xl font-semibold'>Your Polls</p>
            <div className='text-xs font-[600] py-1 px-1.5 rounded-sm bg-primary text-white'>
              New
            </div>
          </div>
          <p className='text-sm text-gray-400 dark:text-gray-600 text-center'>
            Create polls, get insights from your employees and elevate your
            workplaces
          </p>
        </div>
        {polls?.map((poll) => (
          <PollCard poll={poll} key={poll.id} />
        ))}
      </div>
      <CreatePoll open={isOpenCreate} setOpen={setIsOpenCreate} />
    </div>
  );
};

export default Polls;