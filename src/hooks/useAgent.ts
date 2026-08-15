import { useQuery } from '@tanstack/react-query';
import { getAgentById, getAgentReviews } from '@/lib/firestore';
import { Agent, AgentReview } from '@/lib/types';

export const useAgent = (id: string) => {
  return useQuery<Agent | null>({
    queryKey: ['agent', id],
    queryFn: () => getAgentById(id),
    staleTime: 60 * 1000,
    enabled: !!id,
  });
};

export const useAgentReviews = (id: string) => {
  return useQuery<AgentReview[]>({
    queryKey: ['agent_reviews', id],
    queryFn: () => getAgentReviews(id),
    staleTime: 60 * 1000,
    enabled: !!id,
  });
};
