import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messageApi } from '@/lib/api';

// Hook for getting channel messages
export function useChannelMessages(channelId: string, page = 1) {
  return useQuery({
    queryKey: ['messages', 'channel', channelId, page],
    queryFn: () => messageApi.getChannelMessages(channelId, page),
    enabled: !!channelId,
  });
}

// Hook for getting direct messages with a specific user
export function useDirectMessages(userId: string, page = 1) {
  return useQuery({
    queryKey: ['messages', 'direct', userId, page],
    queryFn: () => messageApi.getDirectMessages(userId, page),
    enabled: !!userId,
  });
}

// Hook for sending a channel message
export function useSendChannelMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ channelId, content }: { channelId: string; content: string }) =>
      messageApi.sendChannelMessage(channelId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['messages', 'channel', variables.channelId] 
      });
    },
  });
}

// Hook for sending a direct message
export function useSendDirectMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ recipientId, content }: { recipientId: string; content: string }) =>
      messageApi.sendDirectMessage(recipientId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['messages', 'direct', variables.recipientId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['direct-messages'] 
      });
    },
  });
}