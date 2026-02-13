import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { RequestWithTextTasks, Location, RequestStatus, SubmissionMode } from '../backend';

const TELEGRAM_CHANNEL_URL = 'https://t.me/techcrunchz';

export function useCreateRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      title, 
      description, 
      location,
      submissionMode 
    }: { 
      title: string; 
      description: string; 
      location: Location | null;
      submissionMode: SubmissionMode;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createWorkRequest(title, description, location, submissionMode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['myRequests'] });
      
      if (typeof window !== 'undefined') {
        window.open(TELEGRAM_CHANNEL_URL, '_blank');
      }
    },
  });
}

export function useGetAllRequests() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RequestWithTextTasks[]>({
    queryKey: ['requests', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRequests();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetRequestsByStatus(status: RequestStatus) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RequestWithTextTasks[]>({
    queryKey: ['requests', 'status', status],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRequestsByStatus(status);
    },
    enabled: !!actor && !actorFetching,
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
    queryKey: ['requests', 'available'],
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
    queryKey: ['requests', 'assigned'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyAssignedRequests();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useFilterRequestsByCity(city: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RequestWithTextTasks[]>({
    queryKey: ['requests', 'city', city],
    queryFn: async () => {
      if (!actor) return [];
      return actor.filterRequestsByCity(city);
    },
    enabled: !!actor && !actorFetching && city.length > 0,
  });
}
