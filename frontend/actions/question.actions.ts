'use server';

import axios from 'axios';
import { getTokenValues } from './auth.actions';

export const createQuestion = async ({
  toId,
  question,
}: {
  toId: number;
  question: string;
}) => {
  const { userId, companyId } = await getTokenValues();
  const res = await axios('http://localhost:8080/question', {
    method: 'POST',
    data: {
      from_id: userId,
      to_id: toId,
      question,
      company_id: companyId,
    },
  });

  return;
};

export const getCompanyQuestions = async (): Promise<TQuestion[]> => {
  const { companyId } = await getTokenValues();

  const res = await axios(
    `http://localhost:8080/company/questions/${companyId}`,
    { method: 'GET' }
  );

  return res.data.questions;
};

export const answerQuestion = async ({
  questionId,
  answer,
}: {
  questionId: number;
  answer: string;
}) => {
  const res = await axios(`http://localhost:8080/question/${questionId}`, {
    method: 'PATCH',
    data: {
      answer,
    },
  });

  return;
};
