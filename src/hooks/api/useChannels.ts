import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { channelApi } from '@/lib/api';
import type { Channel } from '@/types';

// Hook for getting all channels
export function useChannels() {
  return useQuery({
    queryKey: ['channels'],
    queryFn: channelApi.getChannels,
  });
}

// Hook for getting a specific channel
export function useChannel(channelId: string) {
  return useQuery({
    queryKey: ['channels', channelId],
    queryFn: () => channelApi.getChannel(channelId),
    enabled: !!channelId,
  });
}

// Hook for creating a new channel
export function useCreateChannel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Channel>) => channelApi.createChannel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channels'] });
    },
  });
}