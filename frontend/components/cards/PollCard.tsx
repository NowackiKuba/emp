'use client';
import { format } from 'date-fns';
import { BarChart, Eye } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { getTokenValues } from '@/actions/auth.actions';
import AnswerPollDialog from '../dialogs/AnswerPollDialog';
import PollInsightsDialog from '../dialogs/PollInsightsDialog';
import { useQuery } from '@tanstack/react-query';
import { getPollAnswers } from '@/actions/poll.actions';
import AnsweredDialog from '../dialogs/AnsweredDialog';
import { cn } from '@/lib/utils';

const PollCard = ({
  poll,
  otherClasses,
}: {
  poll: TPoll;
  otherClasses?: string;
}) => {
  const { data: answers, isLoading } = useQuery({
    queryKey: ['getPollAnswers', poll.id],
    queryFn: async () => await getPollAnswers({ pollId: poll.id }),
  });
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isOpenAnswer, setIsOpenAnswer] = useState<boolean>(false);
  const [isOpenAnswers, setIsOpenAnswers] = useState<boolean>(false);
  const [isOpenInsights, setIsOpenInsights] = useState<boolean>(false);
  useEffect(() => {
    const fetchCurrentUserId = async () => {
      const { userId } = await getTokenValues();
      setCurrentUserId(userId);
    };
    fetchCurrentUserId();
  }, []);
  return (
    <div
      key={poll.id}
      className={cn(
        'h-80 w-full sm:w-96 py-2 rounded-xl bg-secondary flex items-start justify-start flex-col gap-2 px-4',
        otherClasses
      )}
    >
      <div className='flex items-center gap-2'>
        <div className='h-24 w-24 bg-primary/10 rounded-full text-primary dark:bg-red-500/20 dark:text-red-200 flex items-center justify-center'>
          <BarChart className='h-16 w-16' />
        </div>
        <div className='flex flex-col'>
          <p className='text-xl font-[500]'>
            {poll.title}
            {!poll?.title?.includes('?') ? '?' : ''}
          </p>
          <div className='text-sm text-gray-400 dark:text-gray-600 hidden sm:flex items-center gap-2'>
            by
            <Avatar className='h-8 w-8'>
              <AvatarImage src={poll?.created_by?.img_url} />
              <AvatarFallback className='h-8 w-8'>
                <div className='flex items-center justify-center h-8 w-8 rounded-full text-sm font-semibold bg-primary/10 text-primary dark:bg-red-500/20 dark:text-red-200'>
                  {poll?.created_by.first_name[0]}
                  {poll?.created_by.last_name[0]}
                </div>
              </AvatarFallback>
            </Avatar>
            <p>
              {poll?.created_by?.first_name} {poll?.created_by?.last_name}
            </p>
          </div>
        </div>
      </div>
      <p className='text-[15px] text-gray-400 dark:text-gray-200'>
        Starts:{' '}
        <span className='font-[600]'>
          {format(poll?.starts_on || new Date(), 'dd.MM.yyyy')}
        </span>
      </p>
      <p className='text-[15px] text-gray-400 dark:text-gray-200'>
        Ends:{' '}
        <span className='font-[600]'>
          {format(poll?.ends_on || new Date(), 'dd.MM.yyyy')}
        </span>
      </p>
      <div className='flex items-center gap-1 mt-4'>
        {answers?.map((a, i) => (
          <>
            <Avatar
              style={{ marginLeft: `${15 * i}px` }}
              className={`h-8 w-8  ${i + 1 > 3 ? 'hidden' : 'absolute'}`}
              key={a.id}
            >
              <AvatarImage src={a?.answered_by?.img_url} />
              <AvatarFallback className='h-8 w-8'>
                <div className='flex items-center justify-center h-8 w-8 rounded-full text-sm font-semibold bg-primary/10 text-primary dark:bg-red-500/20 dark:text-red-200'>
                  {a?.answered_by.first_name[0]}
                  {a?.answered_by.last_name[0]}
                </div>
              </AvatarFallback>
            </Avatar>
          </>
        ))}
        {answers && answers?.length > 3 ? (
          <p
            onClick={() => setIsOpenAnswers(true)}
            className='text-xs text-gray-400 ml-16 cursor-pointer hover:underline transition-all duration-150'
          >
            +{answers?.length - 3} more already answered{' '}
          </p>
        ) : (
          <p className='text-xs text-gray-400 ml-16'>Already answered</p>
        )}
      </div>
      <div className='flex flex-col items-end justify-end h-full w-full'>
        {poll.created_by_id === currentUserId ? (
          <Button
            onClick={() => setIsOpenInsights(true)}
            className='flex items-center gap-2 w-full'
            variant={'p-outline'}
          >
            <Eye />
            <p>See Insights</p>
          </Button>
        ) : (
          <Button
            onClick={() => setIsOpenAnswer(true)}
            className='flex items-center gap-2 w-full'
            variant={'p-outline'}
            disabled={
              !currentUserId ||
              answers?.map((a) => a.answered_by.id).includes(currentUserId)
            }
          >
            <BarChart />
            <p>
              {' '}
              {answers?.map((a) => a.answered_by.id).includes(currentUserId!)
                ? 'Answered'
                : 'Answer'}
            </p>
          </Button>
        )}
      </div>
      <AnswerPollDialog
        open={isOpenAnswer}
        setOpen={setIsOpenAnswer}
        poll={poll}
      />
      <AnsweredDialog
        open={isOpenAnswers}
        setOpen={setIsOpenAnswers}
        answers={answers!}
      />
      <PollInsightsDialog
        open={isOpenInsights}
        setOpen={setIsOpenInsights}
        poll={poll}
        answers={answers!}
      />
    </div>
  );
};

export default PollCard;
