'use server';

import axios from 'axios';
import { cookies } from 'next/headers';

export const getCompanyEmployees = async (): Promise<TUser[]> => {
  const token = await cookies().get('token');

  const res = await axios(`http://localhost:8080/employees/${token?.value}`, {
    method: 'GET',
  });

  return res.data.employees;
};
