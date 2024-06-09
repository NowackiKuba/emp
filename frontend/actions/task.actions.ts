'use server';

import axios from 'axios';
import { getTokenValues } from './auth.actions';

export const createTask = async ({
  title,
  description,
  deadline,
  priority,
  assignedTo,
}: {
  title: string;
  description: string;
  deadline: Date;
  priority: number;
  assignedTo: string;
}) => {
  const { userId, companyId } = await getTokenValues();

  const res = await axios('http://localhost:8080/task', {
    method: 'POST',
    data: {
      title,
      description,
      deadline,
      priority,
      assigned_to_id: assignedTo,
      assigned_by_id: userId,
      company_id: companyId,
    },
  });

  return;
};

export const getCompanyTasks = async (): Promise<TTask[]> => {
  const { companyId } = await getTokenValues();

  const res = await axios(`http://localhost:8080/company-tasks/${companyId}`, {
    method: 'GET',
  });

  return res.data.tasks;
};
