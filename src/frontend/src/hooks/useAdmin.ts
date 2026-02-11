import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { UserProfile, RequestWithTextTasks } from '../backend';
import { Principal } from '@dfinity/principal';
import { useAuth } from './useAuth';

// Hook to check if caller is admin via backend
export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const { isAuthenticated } = useAuth();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
  });
}

export function useGetAllUsers() {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: isAdmin = false } = useIsCallerAdmin();

  return useQuery<[Principal, UserProfile][]>({
    queryKey: ['allUsers'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getAllUsers();
      } catch (error: any) {
        if (error.message?.includes('Unauthorized')) {
          throw new Error('You do not have permission to view all users');
        }
        throw error;
      }
    },
    enabled: !!actor && !actorFetching && isAdmin,
    retry: false,
  });
}

export function useGetAllRequests() {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: isAdmin = false } = useIsCallerAdmin();

  return useQuery<RequestWithTextTasks[]>({
    queryKey: ['allRequests'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getAllRequests();
      } catch (error: any) {
        if (error.message?.includes('Unauthorized')) {
          throw new Error('You do not have permission to view all requests');
        }
        throw error;
      }
    },
    enabled: !!actor && !actorFetching && isAdmin,
    retry: false,
  });
}

export function useGetAnalytics() {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: isAdmin = false } = useIsCallerAdmin();

  return useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getAnalytics();
      } catch (error: any) {
        if (error.message?.includes('Unauthorized')) {
          throw new Error('You do not have permission to view analytics');
        }
        throw error;
      }
    },
    enabled: !!actor && !actorFetching && isAdmin,
    retry: false,
  });
}

export function useDeleteUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user: Principal) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.deleteUser(user);
      } catch (error: any) {
        if (error.message?.includes('Unauthorized')) {
          throw new Error('You do not have permission to delete users');
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
    },
  });
}

export function useDeleteRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.deleteRequest(requestId);
      } catch (error: any) {
        if (error.message?.includes('Unauthorized')) {
          throw new Error('You do not have permission to delete requests');
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allRequests'] });
    },
  });
}

// Telegram configuration hooks
export function useGetTelegramConfigStatus() {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: isAdmin = false } = useIsCallerAdmin();

  return useQuery<{ isConfigured: boolean; chatId?: string }>({
    queryKey: ['telegramConfigStatus'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getTelegramConfigStatus();
      } catch (error: any) {
        if (error.message?.includes('Unauthorized')) {
          throw new Error('You do not have permission to view Telegram configuration');
        }
        throw error;
      }
    },
    enabled: !!actor && !actorFetching && isAdmin,
    retry: false,
  });
}

export function useSetTelegramConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ botToken, chatId }: { botToken: string; chatId: string }) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.setTelegramConfig(botToken, chatId);
      } catch (error: any) {
        if (error.message?.includes('Unauthorized')) {
          throw new Error('You do not have permission to configure Telegram');
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['telegramConfigStatus'] });
    },
  });
}
