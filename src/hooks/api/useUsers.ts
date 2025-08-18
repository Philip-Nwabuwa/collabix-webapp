import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/lib/api';

// Hook for getting current authenticated user
export function useCurrentUser() {
  return useQuery({
    queryKey: ['users', 'current'],
    queryFn: userApi.getCurrentUser,
  });
}

// Hook for getting all users (for direct messages, etc.)
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: userApi.getUsers,
  });
}