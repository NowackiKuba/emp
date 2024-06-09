'use client';

import { getCurrentUser } from '@/actions/user.actions';
import { useQuery } from '@tanstack/react-query';

export const useUser = () => {
  const { data: user, isLoading } = useQuery({
    queryKey: ['getCurrentUser'],
    queryFn: async () => await getCurrentUser(),
  });

  return { user, isLoading };
};
