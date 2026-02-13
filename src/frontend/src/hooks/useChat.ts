import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Message } from '../backend';

export function useGetMessages(requestId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Message[]>({
    queryKey: ['messages', requestId?.toString()],
    queryFn: async () => {
      if (!actor || requestId === null) return [];
      return actor.getMessages(requestId);
    },
    enabled: !!actor && !actorFetching && requestId !== null,
    refetchInterval: 3000, // Poll every 3 seconds
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId, content }: { requestId: bigint; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendMessage(requestId, content);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.requestId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    },
  });
}

export function useMarkMessageAsRead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.markMessageAsRead(messageId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    },
  });
}

export function useGetUnreadMessageCount(requestId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['unreadCount', requestId?.toString()],
    queryFn: async () => {
      if (!actor || requestId === null) return BigInt(0);
      return actor.getUnreadMessageCount(requestId);
    },
    enabled: !!actor && !actorFetching && requestId !== null,
  });
}
