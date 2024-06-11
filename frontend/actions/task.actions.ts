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
  assignedTo: number;
}) => {
  const { userId, companyId } = await getTokenValues();

  const res = await axios('http://localhost:8080/task', {
    method: 'POST',
    data: {
      title,
      description,
      deadline,
      priority: +priority,
      assigned_to_id: assignedTo,
      assigned_by_id: userId,
      company_id: companyId,
    },
  });

  return;
};

export const getCompanyTasks = async (): Promise<TTask[]> => {
  const { companyId } = await getTokenValues();

  const res = await axios(`http://localhost:8080/tasks/${companyId}`, {
    method: 'GET',
  });

  return res.data.tasks;
};

export const getTaskById = async (taskId: number): Promise<TTask> => {
  const res = await axios(`http://localhost:8080/task/${taskId}`, {
    method: 'GET',
  });

  return res.data.task;
};

export const updateTask = async ({
  title,
  description,
  deadline,
  priority,
  assignedTo,
  assignedBy,
  status,
  id,
}: {
  title: string;
  description: string;
  deadline: Date;
  priority: number;
  assignedTo: number;
  assignedBy: number;
  status?: string;
  id: number;
}) => {
  const res = axios(`http://localhost:8080/task/${id}`, {
    method: 'PATCH',
    data: {
      title,
      description,
      deadline,
      priority,
      assigned_to_id: assignedTo,
      assigned_by_id: assignedBy,
      status,
    },
  });

  return;
};
