'use server';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { cookies } from 'next/headers';

export const createAccount = async ({
  firstName,
  lastName,
  username,
  email,
}: {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}) => {
  const res = await axios('http://localhost:8080/signup', {
    method: 'POST',
    data: {
      firstName,
      lastName,
      username,
      email,
    },
  });
};

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const res = await axios('http://localhost:8080/login', {
    method: 'POST',
    data: {
      email,
      password,
    },
  });

  const token = cookies().set('token', res.data.token, {
    maxAge: 60 * 60 * 24 * 7,
  });

  return token;
};
