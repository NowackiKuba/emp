'use server';

import axios from 'axios';
import { getTokenValues } from './auth.actions';

export const createPoll = async ({
  title,
  description,
  questions,
  starts_on,
  ends_on,
}: {
  title: string;
  description: string;
  questions: string[];
  starts_on: Date;
  ends_on: Date;
}) => {
  const { userId, companyId } = await getTokenValues();
  const res = await axios('http://localhost:8080/poll', {
    method: 'POST',
    data: {
      title,
      description,
      questions,
      starts_on,
      ends_on,
      created_by_id: userId,
      company_id: companyId,
    },
  });

  return;
};

export const getCompanyPolls = async (): Promise<TPoll[]> => {
  const { companyId } = await getTokenValues();
  const res = await axios(`http://localhost:8080/polls/${companyId}`, {
    method: 'GET',
  });

  return res.data.polls;
};

export const getPollAnswers = async ({
  pollId,
}: {
  pollId: number;
}): Promise<TAnswer[]> => {
  const res = await axios(`http://localhost:8080/answers/${pollId}`, {
    method: 'GET',
  });

  return res.data.answers;
};
