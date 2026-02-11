import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { RequestWithTextTasks, Location, RequestStatus } from '../backend';

const TELEGRAM_CHANNEL_URL = 'https://t.me/techcrunchz';

export function useCreateRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      description,
      location,
    }: {
      title: string;
      description: string;
      location: Location | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.createRequest(title, description, location, TELEGRAM_CHANNEL_URL);
      } catch (error) {
        // Re-throw with original error to preserve backend error messages
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myRequests'] });
      queryClient.invalidateQueries({ queryKey: ['availableRequests'] });
      queryClient.invalidateQueries({ queryKey: ['allRequests'] });
    },
  });
}

export function useGetMyRequests() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RequestWithTextTasks[]>({
    queryKey: ['myRequests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyRequests();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAvailableRequests() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RequestWithTextTasks[]>({
    queryKey: ['availableRequests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAvailableRequests();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetMyAssignedRequests() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RequestWithTextTasks[]>({
    queryKey: ['myAssignedRequests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyAssignedRequests();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAcceptRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.acceptRequest(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availableRequests'] });
      queryClient.invalidateQueries({ queryKey: ['myAssignedRequests'] });
      queryClient.invalidateQueries({ queryKey: ['allRequests'] });
    },
  });
}

export function useCompleteRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.completeRequest(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myAssignedRequests'] });
      queryClient.invalidateQueries({ queryKey: ['myRequests'] });
      queryClient.invalidateQueries({ queryKey: ['allRequests'] });
    },
  });
}

export function useFilterRequestsByCity(city: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RequestWithTextTasks[]>({
    queryKey: ['requestsByCity', city],
    queryFn: async () => {
      if (!actor || !city) return [];
      return actor.filterRequestsByCity(city);
    },
    enabled: !!actor && !actorFetching && !!city,
  });
}

export function useGetRequestsByStatus(status: RequestStatus) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RequestWithTextTasks[]>({
    queryKey: ['requestsByStatus', status],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRequestsByStatus(status);
    },
    enabled: !!actor && !actorFetching,
  });
}
