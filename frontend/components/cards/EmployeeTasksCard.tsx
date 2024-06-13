'use client';
import { getEmployeeTasks } from '@/actions/task.actions';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, Ghost } from 'lucide-react';
import React from 'react';
import { Skeleton } from '../ui/skeleton';
import { getPriorityProps } from '@/lib/utils';

const EmployeeTasksCard = ({ userId }: { userId: number }) => {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['getEmployeeTasks', { userId }],
    queryFn: async () => await getEmployeeTasks({ employeeId: userId }),
  });

  if (isLoading) {
    return <Skeleton className='h-80 w-1/3' />;
  }

  return (
    <div className='w-1/3 bg-secondary p-4 rounded-xl flex flex-col h-80 max-h-80 overflow-y-auto'>
      <p className='text-lg font-semibold'>Tasks</p>
      {tasks?.length ? (
        <div className='flex flex-col gap-2 w-full'>
          {tasks.map((t) => {
            const { icon, bg, text, textColor } = getPriorityProps(t.priority);
            const Icon = icon;
            return (
              <div
                key={t.id}
                className='w-full flex items-center justify-between cursor-pointer bg-background p-2 rounded-xl'
              >
                <div className='flex items-center gap-2'>
                  <Icon className='h-10 w-10' />
                  <div className='flex flex-col'>
                    <p className='text-sm font-[500]'>{t?.title}</p>
                    <p className={`text-xs ${textColor}`}>{text}</p>
                  </div>
                </div>
                <ChevronRight />
              </div>
            );
          })}
        </div>
      ) : (
        <div className='flex items-center justify-center flex-col gap-2 h-80'>
          <Ghost className='h-16 w-16 text-gray-600' />
          <p className='text-gray-600 font-[500]'>No Tasks</p>
        </div>
      )}
    </div>
  );
};

export default EmployeeTasksCard;
