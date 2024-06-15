'use client';

import { getUserNotifications } from '@/actions/user.actions';
import { useQuery } from '@tanstack/react-query';

export const useNotifications = ({ userId }: { userId: number }) => {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['getUserNotifications', { userId }],
    queryFn: async () => await getUserNotifications({ userId }),
  });

  return { notifications, isLoading };
};
