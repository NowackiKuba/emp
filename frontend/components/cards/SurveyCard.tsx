'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { CircleCheck, Eye, NotepadText } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { format } from 'date-fns';
import AnswerSurveyDialog from '../dialogs/AnswerSurveyDialog';
import { getTokenValues } from '@/actions/auth.actions';
import SurveyInsights from '../dialogs/SurveyInsights';

interface Props {
  survey: TSurvey;
}

const SurveyCard = ({ survey }: Props) => {
  const [isOpenAnswer, setIsOpenAnswer] = useState<boolean>(false);
  const [isOpenInsights, setIsOpenInsights] = useState<boolean>(false);
  const [currentUserId, SetCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCurrentUserId = async () => {
      const { userId } = await getTokenValues();
      SetCurrentUserId(userId);
    };
    fetchCurrentUserId();
  }, []);
  return (
    <div
      key={survey.id}
      className='h-80 w-full sm:w-96 rounded-xl p-2 bg-secondary flex flex-col gap-1'
    >
      <div className='flex items-center gap-2'>
        <div className='h-24 w-24 bg-primary/10 rounded-full text-primary dark:bg-red-500/20 dark:text-red-200 flex items-center justify-center'>
          <NotepadText className='h-16 w-16' />
        </div>
        <div className='flex flex-col'>
          <p className='text-xl font-[500]'>
            {survey.title}
            {!survey?.title?.includes('?') ? '?' : ''}
          </p>
          <div className='text-sm text-gray-400 dark:text-gray-600 flex items-center gap-2'>
            by
            <Avatar className='h-8 w-8'>
              <AvatarImage src={survey?.created_by?.img_url} />
              <AvatarFallback className='h-8 w-8'>
                <div className='flex items-center justify-center h-8 w-8 rounded-full text-sm font-semibold bg-primary/10 text-primary dark:bg-red-500/20 dark:text-red-200'>
                  {survey?.created_by.first_name[0]}
                  {survey?.created_by.last_name[0]}
                </div>
              </AvatarFallback>
            </Avatar>
            <p>
              {survey?.created_by?.first_name} {survey?.created_by?.last_name}
            </p>
          </div>
        </div>
      </div>
      <div className='flex mt-4 flex-col items-start justify-start gap-1.5'>
        <p className='text-[15px] text-gray-400 dark:text-gray-200'>
          Starts:{' '}
          <span className='font-[600]'>
            {format(survey?.start_date || new Date(), 'dd.MM.yyyy')}
          </span>
        </p>
        <p className='text-[15px] text-gray-400 dark:text-gray-200'>
          Ends:{' '}
          <span className='font-[600]'>
            {format(survey?.end_date || new Date(), 'dd.MM.yyyy')}
          </span>
        </p>
      </div>
      <div className='flex flex-col h-full items-end justify-end w-full'>
        {currentUserId === survey.created_by_id ? (
          <Button
            className='w-full flex items-center gap-2'
            onClick={() => setIsOpenInsights(true)}
          >
            <Eye />
            <p>See Insights</p>
          </Button>
        ) : (
          <Button className='w-full flex items-center gap-2'>
            <CircleCheck />
            <p>Take a survey</p>
          </Button>
        )}
      </div>
      <AnswerSurveyDialog
        open={isOpenAnswer}
        setOpen={setIsOpenAnswer}
        creatorFullName={`${survey?.created_by?.first_name} ${survey?.created_by?.last_name}`}
        surveyId={survey.id}
        surveyTitle={survey.title}
      />
      <SurveyInsights
        open={isOpenInsights}
        setOpen={setIsOpenInsights}
        survey={survey}
      />
    </div>
  );
};

export default SurveyCard;
