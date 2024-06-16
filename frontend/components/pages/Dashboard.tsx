'use client';
import { useUser } from '@/hooks/useUser';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import StartWorkDialog from '../dialogs/StartWorkDialog';
import { useCompanyEmployees } from '@/hooks/useCompanyEmployees';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ChevronRight } from 'lucide-react';
import EmployeeDetails from '../dialogs/EmployeeDetails';
import ActivePolls from '../cards/ActivePolls';

const Dashboard = () => {
  const { user } = useUser();
  const [isOpenStartWork, setIsOpenStartWork] = useState<boolean>(false);
  const { employees, isLoading } = useCompanyEmployees();
  const [selectedEmployee, setSelectedEmployee] = useState<TUser>();
  const [isOpenEmployeeDetails, setIsOpenEmployeeDetails] =
    useState<boolean>(false);
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

  const workingEmployees = employees?.filter((e) => e.is_working);
  return (
    <div className='flex flex-col gap-4 w-full sm:pb-8 pb-2'>
      <p className='text-2xl font-semibold'>
        Hi 👋🏻, {user?.first_name} {user?.last_name}
      </p>
      <div className='flex items-center gap-4'>
        <div className='rounded-xl bg-secondary h-96 w-full overflow-x-auto max-w-96 hidden md:flex flex-col items-start justify-end pb-8 px-4'>
          <p>Today</p>
          <p className='text-[28px] font-semibold'>
            {format(new Date(), 'PPPP')}
          </p>
        </div>
        <ActivePolls />
      </div>
      <div className='flex md:flex-row flex-col items-center gap-4'>
        <div className='rounded-xl bg-secondary w-full h-80 flex flex-col py-2 px-4'>
          <div className='flex items-center gap-2.5'>
            <div className='h-5 w-5 rounded-full bg-green-500' />
            <p className='text-xl font-[500]'>Currently Working</p>
          </div>
          <div className='flex  flex-col w-full  gap-2'>
            {!workingEmployees?.length && (
              <div className='flex items-center flex-col justify-center gap-1 h-64'>
                <p className='text-lg font-semibold'>
                  No one is working right now
                </p>
                <p className='text-gray-400'>Start working to show up here</p>
              </div>
            )}
            {workingEmployees?.map((e) => (
              <div
                onClick={() => {
                  setSelectedEmployee(e);
                  setIsOpenEmployeeDetails(true);
                }}
                key={e.id}
                className={` w-full p-2 bg-background rounded-xl cursor-pointer flex items-center justify-between`}
              >
                <div className='flex items-center gap-2'>
                  <Avatar className='rounded-xl h-16 w-16'>
                    <AvatarImage className='h-full w-full rounded-xl object-cover' />
                    <AvatarFallback className='h-16 w-16 rounded-xl'>
                      <div className='h-full w-full flex items-center justify-center bg-primary/10 text-primary dark:bg-red-500/20 dark:text-red-200 text-2xl font-bold'>
                        {e.first_name[0]}
                        {e.last_name[0]}
                      </div>
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col'>
                    <p className='text-lg font-[500]'>
                      {e.first_name} {e.last_name}
                    </p>
                    <p>Started: {format(e.work_start, 'HH:mm')}</p>
                  </div>
                </div>
                <ChevronRight />
              </div>
            ))}
          </div>
        </div>
        <div className='w-full bg-secondary rounded-xl h-80'></div>
      </div>

      <StartWorkDialog
        open={isOpenStartWork}
        setOpen={setIsOpenStartWork}
        full_name={`${user?.first_name} ${user?.last_name}`}
        userId={user?.id!}
      />
      <EmployeeDetails
        open={isOpenEmployeeDetails}
        setOpen={setIsOpenEmployeeDetails}
        user={selectedEmployee!}
      />
    </div>
  );
};

export default Dashboard;
