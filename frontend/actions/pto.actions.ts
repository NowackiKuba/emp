'use server';

import axios from 'axios';
import { getTokenValues } from './auth.actions';

export const createPTO = async ({
  title,
  description,
  startDate,
  endDate,
}: {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
}) => {
  const { companyId, userId } = await getTokenValues();

  const res = await axios('http://localhost:8080/pto', {
    method: 'POST',
    data: {
      title,
      description,
      start_date: startDate,
      end_date: endDate,
      company_id: companyId,
      send_by_id: userId,
    },
  });

  return;
};

export const getCompanyPtos = async (): Promise<TPTO[]> => {
  const { companyId } = await getTokenValues();

  const res = await axios(`http://localhost:8080/pto/${companyId}`, {
    method: 'GET',
  });

  return res.data.ptos;
};

export const answerPTO = async ({
  ptoId,
  decision,
  userId,
}: {
  ptoId: number;
  decision: 'ACCEPTED' | 'REJECTED';
  userId: number;
}) => {
  const res = await axios(
    `http://localhost:8080/pto/${ptoId}?userId=${userId}`,
    {
      method: 'PATCH',
      data: {
        status: decision,
        accepted: decision === 'ACCEPTED' ? true : false,
      },
    }
  );

  return;
};
