import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Rating } from '../backend';
import { Principal } from '@dfinity/principal';

export function useAddRating() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      requestId,
      helperUser,
      score,
      comment,
    }: {
      requestId: bigint;
      helperUser: Principal;
      score: bigint;
      comment: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addRating(requestId, helperUser, score, comment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myRatingsAsHelper'] });
      queryClient.invalidateQueries({ queryKey: ['allRatings'] });
    },
  });
}

export function useGetMyRatingsAsHelper() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Rating[]>({
    queryKey: ['myRatingsAsHelper'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyRatingsAsHelper();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetRatingsByUser(user: Principal | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Rating[]>({
    queryKey: ['ratingsByUser', user?.toString()],
    queryFn: async () => {
      if (!actor || !user) return [];
      return actor.getRatingsByUser(user);
    },
    enabled: !!actor && !actorFetching && !!user,
  });
}
