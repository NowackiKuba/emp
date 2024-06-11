'use server';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { cookies } from 'next/headers';

export const createAccount = async ({
  firstName,
  lastName,
  email,
  password,
  companyId,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  companyId: number;
}) => {
  const res = await axios.post('http://localhost:8080/signup', {
    first_name: firstName,
    last_name: lastName,
    email: email,
    password: password,
    role: 'ADMIN',
    company_id: companyId,
    position: 'Manager',
  });

  return res.data;
};

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const res = await axios.post('http://localhost:8080/login', {
    email,
    password,
  });

  if (res) {
    const token = cookies().set('token', res.data.token, {
      maxAge: 60 * 60 * 24 * 7 * 3600,
    });

    return res.data.user;
  }

  return null;
};

export const createCompany = async ({
  name,
  email,
  logoUrl,
}: {
  name: string;
  email: string;
  logoUrl: string;
}) => {
  const res = await axios.post('http://localhost:8080/create-company', {
    name,
    email,
    logoUrl,
  });

  return res.data;
};

export const getTokenValues = async () => {
  const token = cookies().get('token');

  const secretKey = 'supersecert';

  const decoded = jwt.verify(token?.value!, secretKey);

  // @ts-ignore
  const { userId, companyId, email } = decoded;

  return { userId, companyId, email };
};
