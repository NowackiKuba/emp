import { getUserWorkHistory } from '@/actions/user.actions';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ChevronRight, Clock, Ghost } from 'lucide-react';
import React from 'react';

const EmployeeWorkHistoryCard = ({ userId }: { userId: number }) => {
  const { data: workHistory, isLoading } = useQuery({
    queryKey: ['getEmployeeWorkHistory', { userId }],
    queryFn: async () => await getUserWorkHistory({ userId }),
  });

  console.log(workHistory);
  return (
    <div className='w-2/3 bg-secondary p-4 rounded-xl flex flex-col h-80 max-h-80 overflow-y-auto'>
      <p className='text-lg font-semibold'>Work History</p>
      {!workHistory?.length ? (
        <div className='flex flex-col items-center justify-center gap-2 w-full h-full'>
          <Ghost className='h-24 w-24 text-gray-600' />
          <p className='text-gray-600 font-[500]'>No History</p>
        </div>
      ) : (
        <div className='flex flex-col items-start justify-start w-full gap-2'>
          {workHistory.map((h) => (
            <div
              key={h.id}
              className='flex items-center justify-between w-full rounded-xl p-2 bg-background'
            >
              <div className='flex items-center gap-2'>
                <div className='h-16 w-16 bg-blue-500/10 dark:bg-blue-500/20 dark:text-blue-200 text-blue-500 flex items-center justify-center rounded-xl'>
                  <Clock className='h-8 w-8' />
                </div>
                <div className='flex flex-col'>
                  <p className='text-lg font-[500]'>
                    {format(h.created_at, 'dd.MM.yyyy HH:mm')}
                  </p>
                  <p className='text-sm text-gray-400'>Duration: {h.hours}H</p>
                </div>
              </div>
              <ChevronRight />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeWorkHistoryCard;
