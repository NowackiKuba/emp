'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { CirclePlus, Eye } from 'lucide-react';
import CreateSurvey from '../dialogs/CreateSurvey';
import { useQuery } from '@tanstack/react-query';
import { getCompanySurveys } from '@/actions/survey.actions';
import { getTokenValues } from '@/actions/auth.actions';
import SurveyCard from '../cards/SurveyCard';

const Surveys = () => {
  const [isOpenCreate, setIsOpenCreate] = useState<boolean>(false);

  const { data: surveys, isLoading } = useQuery({
    queryKey: ['getSurveys'],
    queryFn: async () => await getCompanySurveys(),
  });

  const [currentUserId, SetCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCurrentUserId = async () => {
      const { userId } = await getTokenValues();
      SetCurrentUserId(userId);
    };
    fetchCurrentUserId();
  }, []);
  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className='flex items-center justify-between w-full'>
        <p className='text-2xl font-semibold'>Surveys</p>
        <Button
          className='flex items-center gap-2'
          onClick={() => setIsOpenCreate(true)}
        >
          <CirclePlus />
          <p>Create Survey</p>
        </Button>
      </div>
      <div className='flex items-center gap-2 w-full'>
        {surveys?.map((s) => (
          <SurveyCard currentUserId={currentUserId} survey={s} key={s.id} />
        ))}
      </div>
      <CreateSurvey open={isOpenCreate} setOpen={setIsOpenCreate} />
    </div>
  );
};

export default Surveys;
