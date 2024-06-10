'use client';

import { getCompanyTasks } from '@/actions/task.actions';
import { useQuery } from '@tanstack/react-query';

export const useTasks = () => {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['getCompanyTasks'],
    queryFn: async () => await getCompanyTasks(),
  });

  return { tasks, isLoading };
};
