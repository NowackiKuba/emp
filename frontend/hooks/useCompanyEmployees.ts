'use client';

import { getCompanyEmployees } from '@/actions/company.actions';
import { useQuery } from '@tanstack/react-query';

export const useCompanyEmployees = () => {
  const { data: employees, isLoading } = useQuery({
    queryKey: ['getCompanyEmployees'],
    queryFn: async () => await getCompanyEmployees(),
  });

  return { employees, isLoading };
};
