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

export const editEmployee = async ({
  firstName,
  lastName,
  email,
  password,
  role,
  position,
  image,
  id,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  position: string;
  image: string;
  id: number;
}) => {
  const res = await axios(`http://localhost:8080/employee/${id}`, {
    method: 'PATCH',
    data: {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      role,
      position,
      img_url: image,
    },
  });

  return;
};

export const deleteEmployee = async ({ id }: { id: number }) => {
  const res = await axios(`http://localhost:8080/employee/${id}`, {
    method: 'DELETE',
  });

  return;
};

export const endWork = async ({
  userId,
  hours,
}: {
  userId: number;
  hours: number;
}) => {
  const res = await axios(`http://localhost:8080/end-work/${userId}`, {
    method: 'PATCH',
    data: {
      hours,
      user_id: userId,
    },
  });

  return;
};

export const getUserWorkHistory = async ({
  userId,
}: {
  userId: number;
}): Promise<TWorkDay[]> => {
  const res = await axios(
    `http://localhost:8080/employee/work-history/${userId}`,
    { method: 'GET' }
  );

  return res.data.history;
};

export const manageBreak = async ({
  id,
  isOnBreak,
}: {
  id: number;
  isOnBreak: boolean;
}) => {
  const res = await axios(`http://localhost:8080/manage-break/${id}`, {
    method: 'PATCH',
    data: {
      is_on_break: isOnBreak,
    },
  });

  return;
};

export const getUserAnsweredPolls = async ({
  userId,
}: {
  userId: number;
}): Promise<TPoll[]> => {
  const res = await axios(
    `http://localhost:8080/user/answered-polls/${userId}`,
    {
      method: 'GET',
    }
  );

  return res.data.polls;
};
export const getUserAnsweredSurveys = async ({
  userId,
}: {
  userId: number;
}): Promise<TSurvey[]> => {
  const res = await axios(
    `http://localhost:8080/user/answered-surveys/${userId}`,
    {
      method: 'GET',
    }
  );

  return res.data.surveys;
};
