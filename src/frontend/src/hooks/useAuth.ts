import { useInternetIdentity } from './useInternetIdentity';
import { useActor } from './useActor';
import { useGetCallerUserProfile } from './useCurrentUserProfile';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { UserRole } from '../backend';

export function useAuth() {
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const { actor } = useActor();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const isProfileReady = isAuthenticated && isFetched && userProfile !== null;

  const logout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const navigateToDashboard = (role: UserRole) => {
    switch (role) {
      case UserRole.student:
        navigate({ to: '/dashboard/student' });
        break;
      case UserRole.helper:
        navigate({ to: '/dashboard/helper' });
        break;
      case UserRole.admin:
        navigate({ to: '/dashboard/admin' });
        break;
      case UserRole.business:
        navigate({ to: '/dashboard/helper' });
        break;
      case UserRole.client:
        navigate({ to: '/work-request' });
        break;
    }
  };

  const isStudent = userProfile?.role === UserRole.student;
  const isHelper = userProfile?.role === UserRole.helper;
  const isBusiness = userProfile?.role === UserRole.business;
  const isAdmin = userProfile?.role === UserRole.admin;
  const isClient = userProfile?.role === UserRole.client;

  return {
    identity,
    login,
    logout,
    loginStatus,
    isAuthenticated,
    isProfileReady,
    userProfile,
    profileLoading,
    actor,
    navigateToDashboard,
    isStudent,
    isHelper,
    isBusiness,
    isAdmin,
    isClient,
  };
}
