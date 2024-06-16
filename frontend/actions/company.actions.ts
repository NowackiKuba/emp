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
  const { companyId } = await getTokenValues();

  const res = await axios(`http://localhost:8080/company/${companyId}`);

  return res.data.company;
};

export const updateCompany = async ({
  name,
  email,
  logo_url,
}: {
  name: string;
  email: string;
  logo_url: string;
}) => {
  const { companyId } = await getTokenValues();
  const res = await axios(`http://localhost:8080/company/${companyId}`, {
    method: 'PATCH',
    data: {
      name,
      email,
      logo_url,
    },
  });

  return;
};
