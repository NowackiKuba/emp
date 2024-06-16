'use client';

import { getCompanyPolls } from '@/actions/poll.actions';
import { useQuery } from '@tanstack/react-query';

export const usePolls = ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) => {
  const { data: polls, isLoading } = useQuery({
    queryKey: ['getCompanyPolls'],
    queryFn: async () => await getCompanyPolls({ startDate, endDate }),
  });

  return { polls, isLoading };
};
