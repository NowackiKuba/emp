'use client';
import { useUser } from '@/hooks/useUser';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import StartWorkDialog from '../dialogs/StartWorkDialog';

const Dashboard = () => {
  const { user } = useUser();
  const [isOpenStartWork, setIsOpenStartWork] = useState<boolean>(false);
  useEffect(() => {
    if (!user) return;

    if (
      (user.role.toLowerCase() === 'employee' ||
        user.role.toLowerCase() === 'manager') &&
      !user.is_working &&
      !user?.is_on_vacation
    ) {
      setIsOpenStartWork(true);
    }
  }, [user]);
  return (
    <div className='flex flex-col gap-4 w-full'>
      <p className='text-2xl font-semibold'>
        Hi 👋🏻, {user?.first_name} {user?.last_name}
      </p>
      <div className='flex items-center gap-4'>
        <div className='rounded-xl bg-secondary h-64 w-96 flex flex-col items-start justify-end pb-8 px-4'>
          <p>Today</p>
          <p className='text-[28px] font-semibold'>
            {format(new Date(), 'PPPP')}
          </p>
        </div>
      </div>
      <StartWorkDialog
        open={isOpenStartWork}
        setOpen={setIsOpenStartWork}
        full_name={`${user?.first_name} ${user?.last_name}`}
        userId={user?.id!}
      />
    </div>
  );
};

export default Dashboard;
