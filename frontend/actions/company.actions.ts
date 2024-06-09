'use server';

import axios from 'axios';
import { cookies } from 'next/headers';
import { getTokenValues } from './auth.actions';

export const getCompanyEmployees = async (): Promise<TUser[]> => {
  const { companyId } = await getTokenValues();

  const res = await axios(`http://localhost:8080/employees/${companyId}`, {
    method: 'GET',
  });

  return res.data.employees;
};

export const getCompanyById = async (): Promise<TCompany> => {
  const token = cookies().get('token');

  const res = await axios(`http://localhost:8080/company/${token?.value}`);

  return res.data.company;
};
