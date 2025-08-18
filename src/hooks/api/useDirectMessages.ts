import { useQuery } from '@tanstack/react-query';
import { directMessageApi } from '@/lib/api';

// Hook for getting all direct message threads/conversations
export function useDirectMessageThreads() {
  return useQuery({
    queryKey: ['direct-messages'],
    queryFn: directMessageApi.getDirectMessageThreads,
  });
}