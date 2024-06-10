'use client';

import { getTaskById } from '@/actions/task.actions';
import { useQuery } from '@tanstack/react-query';

export const useTask = (id: number) => {
  const { data: task, isLoading } = useQuery({
    queryKey: ['getTaskById', { id }],
    queryFn: async () => await getTaskById(id),
  });

  return { task, isLoading };
};
