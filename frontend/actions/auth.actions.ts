'use server';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { cookies } from 'next/headers';

export const createAccount = async ({
  firstName,
  lastName,
  email,
  password,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  const res = await axios('http://localhost:8080/signup', {
    method: 'POST',
    data: {
      firstName,
      lastName,
      email,
      password,
      role: 'ADMIN',
    },
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
      maxAge: 60 * 60 * 24 * 7,
    });

    return res.data.user;
  }

  return null;
};

export const createCompany = async ({
  name,
  email,
  logoUrl,
  users,
}: {
  name: string;
  email: string;
  logoUrl: string;
  users: string[];
}) => {
  const res = await axios.post('http://localhost:8080/create-company', {
    name,
    email,
    logoUrl,
    users,
  });

  return res;
};

export const getTokenValues = async () => {
  const token = cookies().get('token');

  const secretKey = 'supersecert';

  const decoded = jwt.verify(token?.value!, secretKey);

  // @ts-ignore
  const { userId, companyId, email } = decoded;

  return { userId, companyId, email };
};
