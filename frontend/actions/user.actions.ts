'use server';

import axios from 'axios';
import { cookies } from 'next/headers';
import { getTokenValues } from './auth.actions';

export const getCurrentUser = async () => {
  const token = await cookies().get('token');

  if (!token) {
    return null;
  }

  const res = await axios(`http://localhost:8080/user/${token.value}`, {
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
      firstName,
      lastName,
      email,
      password,
      role,
      position,
      company: companyId,
      imgUrl: image,
    },
  });

  return;
};
