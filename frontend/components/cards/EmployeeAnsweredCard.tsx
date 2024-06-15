import {
  getUserAnsweredPolls,
  getUserAnsweredSurveys,
} from '@/actions/user.actions';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { BarChart, ChevronRight } from 'lucide-react';
import React from 'react';

const EmployeeAnsweredCard = ({
  userId,
  type,
}: {
  userId: number;
  type: string;
}) => {
  const { data: polls, isLoading } = useQuery({
    queryKey: ['getUserAnsweredPolls', { userId }],
    queryFn: async () => await getUserAnsweredPolls({ userId }),
  });
  const { data: surveys, isLoading: isLoadingSurveys } = useQuery({
    queryKey: ['getUserAnsweredSurveys', { userId }],
    queryFn: async () => await getUserAnsweredSurveys({ userId }),
  });
  return (
    <div className='w-1/2 rounded-xl bg-secondary p-4 flex flex-col h-64 overflow-y-auto max-h-64'>
      <p className='text-lg font-semibold'>
        Answered {type === 'poll' ? 'Polls' : 'Surveys'}
      </p>
      <div className='flex flex-col gap-2 w-full'>
        {type === 'poll' ? (
          <>
            {polls?.map((p) => (
              <div
                key={p.id}
                className='flex items-center gap-2 w-full p-2 bg-background rounded-xl justify-between'
              >
                <div className='flex items-center gap-2'>
                  <div className='h-14 w-14 rounded-xl bg-primary/10 text-primary dark:bg-red-500/20 dark:text-red-200 flex items-center justify-center'>
                    <BarChart className='h-7 w-7' />
                  </div>
                  <div className='flex flex-col'>
                    <p className='text-lg font-semibold'>{p.title}</p>
                    <p className='text-sm text-gray-400'>
                      {format(p.created_at, 'dd.MM.yyyy')}
                    </p>
                  </div>
                </div>
                <ChevronRight />
              </div>
            ))}
          </>
        ) : (
          <>
            {surveys?.map((s) => (
              <div
                key={s.id}
                className='flex items-center gap-2 w-full p-2 bg-background rounded-xl justify-between'
              >
                <div className='flex items-center gap-2'>
                  <div className='h-14 w-14 rounded-xl bg-primary/10 text-primary dark:bg-red-500/20 dark:text-red-200 flex items-center justify-center'>
                    <BarChart className='h-7 w-7' />
                  </div>
                  <div className='flex flex-col'>
                    <p className='text-lg font-semibold'>{s.title}</p>
                    <p className='text-sm text-gray-400'>
                      {format(s.created_at, 'dd.MM.yyyy')}
                    </p>
                  </div>
                </div>
                <ChevronRight />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeAnsweredCard;
