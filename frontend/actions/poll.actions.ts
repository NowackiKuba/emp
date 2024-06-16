'use server';

import axios from 'axios';
import { getTokenValues } from './auth.actions';
import { format } from 'date-fns';

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

export const getCompanyPolls = async ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}): Promise<TPoll[]> => {
  const { companyId } = await getTokenValues();
  const res = await axios(
    `http://localhost:8080/polls/${companyId}?start_date=${startDate}&end_date=${endDate}`,
    {
      method: 'GET',
    }
  );

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

export const answerPoll = async ({
  pollId,
  answer,
}: {
  pollId: number;
  answer: string;
}) => {
  const { userId } = await getTokenValues();
  const res = await axios(`http://localhost:8080/answer`, {
    method: 'POST',
    data: {
      poll_id: pollId,
      answered_by_id: userId,
      answer,
    },
  });

  return;
};
