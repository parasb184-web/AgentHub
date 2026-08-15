import { useQuery } from '@tanstack/react-query';
import { getAgents } from '@/lib/firestore';
import { Agent } from '@/lib/types';

export const useAgents = () => {
  return useQuery<Agent[]>({
    queryKey: ['agents'],
    queryFn: getAgents,
    staleTime: 60 * 1000,
  });
};
