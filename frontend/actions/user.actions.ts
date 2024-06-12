'use server';

import axios from 'axios';
import { cookies } from 'next/headers';
import { getTokenValues } from './auth.actions';

export const getCurrentUser = async (): Promise<TUser> => {
  const { userId } = await getTokenValues();

  const res = await axios(`http://localhost:8080/user/${userId}`, {
    method: 'GET',
  });

  return res.data.user;
};

export const createEmployeeAccount = async ({
  firstName,
  lastName,
  email,
  password,
  role,
  position,
  image,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  position: string;
  image: string;
}) => {
  const { companyId } = await getTokenValues();
  const res = await axios(`http://localhost:8080/create-employee`, {
    method: 'POST',
    data: {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      role,
      position,
      company_id: companyId,
      img_url: image,
    },
  });

  return;
};

export const Test = async () => {
  return await getTokenValues();
};

export const startWork = async ({ userId }: { userId: number }) => {
  const res = await axios(`http://localhost:8080/start-work/${userId}`, {
    method: 'PATCH',
  });

  return;
};
