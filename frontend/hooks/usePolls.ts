'use client';

import { getCompanyPolls } from '@/actions/poll.actions';
import { useQuery } from '@tanstack/react-query';

export const usePolls = () => {
  const { data: polls, isLoading } = useQuery({
    queryKey: ['getCompanyPolls'],
    queryFn: async () => await getCompanyPolls(),
  });

  return { polls, isLoading };
};
