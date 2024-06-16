'use server';

import axios from 'axios';
import { getTokenValues } from './auth.actions';
import { start } from 'repl';

export const createSurvey = async ({
  title,
  startDate,
  endDate,
  questions,
}: {
  title: string;
  startDate: Date;
  endDate: Date;
  questions: any;
}) => {
  const { companyId, userId } = await getTokenValues();

  const res = await axios('http://localhost:8080/survey', {
    method: 'POST',
    data: {
      created_by_id: userId,
      company_id: companyId,
      title,
      start_date: startDate,
      end_date: endDate,
      survey_questions: questions,
    },
  });

  return res;
};

export const getCompanySurveys = async (): Promise<TSurvey[]> => {
  const { companyId } = await getTokenValues();

  const res = await axios(`http://localhost:8080/surveys/${companyId}`, {
    method: 'GET',
  });

  return res.data.surveys;
};

export const getSurveyQuestions = async ({
  surveyId,
}: {
  surveyId: number;
}): Promise<TSurveyQuestion[]> => {
  const res = await axios(`http://localhost:8080/questions/${surveyId}`, {
    method: 'GET',
  });

  return res.data.questions;
};

export const answerSurvey = async ({
  surveyId,
  answers,
}: {
  surveyId: number;
  answers: string[];
}) => {
  const { userId } = await getTokenValues();

  const res = await axios('http://localhost:8080/answer-survey', {
    method: 'POST',
    data: {
      answered_by_id: userId,
      answers,
      survey_id: surveyId,
    },
  });

  return;
};

export const getSurveyAnswers = async ({ surveyId }: { surveyId: number }) => {
  const res = await axios(`http://localhost:8080/survey/answers/${surveyId}`, {
    method: 'GET',
  });

  return res.data.answers;
};
