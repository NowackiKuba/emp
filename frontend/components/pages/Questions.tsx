'use client';
import { getCompanyQuestions } from '@/actions/question.actions';
import { useQuery } from '@tanstack/react-query';
import { CircleHelp } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import AnswerQuestion from '../dialogs/AnswerQuestion';
import { format } from 'date-fns';

const Questions = () => {
  const { data: questions, isLoading } = useQuery({
    queryKey: ['getCompanyQuestions'],
    queryFn: async () => await getCompanyQuestions(),
  });
  const [isOpenAnswer, setIsOpenAnswer] = useState<boolean>(false);
  const [selectedQuestion, setSelectedQuestion] = useState<TQuestion>();
  console.log(questions);
  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className='flex items-center justify-between'>
        <p className='text-2xl font-semibold'>Questions</p>
      </div>
      <div className='flex items-center flex-wrap gap-2'>
        <div className='h-80 w-80 rounded-xl bg-secondary gap-2 p-2 flex flex-col items-center justify-center'>
          <div className='flex items-center justify-center h-32 w-32 rounded-full bg-primary/10 text-primary dark:bg-red-500/20 dark:text-red-200'>
            <CircleHelp className='h-14 w-14' />
          </div>
          <div className='flex items-center gap-2'>
            <p className='text-xl font-semibold'>Questions</p>
            <div className='text-xs font-[600] py-1 px-1.5 rounded-sm bg-primary text-white'>
              New
            </div>
          </div>
          <p className='text-gray-400'>Ask questions to your employees</p>
        </div>
        {questions?.map((q) => (
          <div
            key={q.id}
            className='h-80 w-80 rounded-xl bg-secondary p-2 flex flex-col gap-2'
          >
            <div className='flex items-center gap-2'>
              <div className='h-20 w-20 rounded-full bg-primary/10 text-primary dark:bg-red-500/20 dark:text-red-200 flex items-center justify-center'>
                <CircleHelp className='h-10 w-10' />
              </div>
              <div className='flex flex-col'>
                <p className='text-xl font-semibold'>{q.question}</p>
                <p className='text-gray-400 text-sm'>
                  asked by {q.from.first_name} {q.from.last_name}
                </p>
                <p className='text-gray-400 text-sm'>
                  at {format(q.created_at, 'dd.MM.yyyy, HH:mm')}
                </p>
              </div>
            </div>
            {q.answer != null && (
              <div className='flex flex-col gap-0.5 mt-4'>
                <p className='text-lg font-semibold'>Answer</p>
                <p className='text-gray-400 italic'>{q.answer}</p>
                <p className='text-xs text-gray-400'>
                  {format(q.updated_at, 'dd.MM.yyyy, HH:mm')}
                </p>
              </div>
            )}
            <div className='flex flex-col justify-end h-full w-full'>
              <Button
                disabled={q.answer != null || q.answer !== undefined}
                className='w-full'
                onClick={() => {
                  setSelectedQuestion(q);
                  setIsOpenAnswer(true);
                }}
              >
                {q.answer != null || q.answer !== undefined
                  ? 'Answered'
                  : 'Answer Question'}
              </Button>
            </div>
          </div>
        ))}
      </div>
      <AnswerQuestion
        open={isOpenAnswer}
        setOpen={setIsOpenAnswer}
        question={selectedQuestion!}
      />
    </div>
  );
};

export default Questions;
