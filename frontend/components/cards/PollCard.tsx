import { format } from 'date-fns';
import { BarChart, Eye } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { getTokenValues } from '@/actions/auth.actions';
import AnswerPollDialog from '../dialogs/AnswerPollDialog';
import PollInsightsDialog from '../dialogs/PollInsightsDialog';

const PollCard = ({ poll }: { poll: TPoll }) => {
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isOpenAnswer, setIsOpenAnswer] = useState<boolean>(false);
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
      className='h-80 w-80 py-2 rounded-xl bg-secondary flex items-start justify-start flex-col gap-2 px-4'
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
          <div className='text-sm text-gray-400 dark:text-gray-600 flex items-center gap-2'>
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
      <p>Starts: {format(poll?.starts_on || new Date(), 'dd.MM.yyyy')}</p>
      <p>Ends: {format(poll?.ends_on || new Date(), 'dd.MM.yyyy')}</p>
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
              !currentUserId || poll?.answered_by?.includes(currentUserId)
            }
          >
            <BarChart />
            <p>Answer</p>
          </Button>
        )}
      </div>
      <AnswerPollDialog
        open={isOpenAnswer}
        setOpen={setIsOpenAnswer}
        poll={poll}
      />
      <PollInsightsDialog
        open={isOpenInsights}
        setOpen={setIsOpenInsights}
        poll={poll}
      />
    </div>
  );
};

export default PollCard;
