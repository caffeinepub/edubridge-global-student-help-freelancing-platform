import { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from '@tanstack/react-router';
import { UserRole } from '../backend';
import AccessDeniedScreen from '../components/auth/AccessDeniedScreen';
import { useIsCallerAdmin } from '../hooks/useAdmin';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'student' | 'helper' | 'business' | 'admin' | 'client';
  nonAdminOnly?: boolean;
}

export default function ProtectedRoute({ children, requiredRole, nonAdminOnly }: ProtectedRouteProps) {
  const { isAuthenticated, isProfileReady, profileLoading, userProfile } = useAuth();
  const { data: isBackendAdmin, isLoading: checkingAdmin, isFetched: adminCheckFetched } = useIsCallerAdmin();

  if (profileLoading || (requiredRole === 'admin' && checkingAdmin)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isProfileReady) {
    return <Navigate to="/login" />;
  }

  // Handle non-admin only routes (for regular users)
  if (nonAdminOnly) {
    if (userProfile?.role === UserRole.admin) {
      return <AccessDeniedScreen />;
    }
  }

  if (requiredRole) {
    const roleMap: Record<string, UserRole> = {
      student: UserRole.student,
      helper: UserRole.helper,
      business: UserRole.business,
      admin: UserRole.admin,
      client: UserRole.client,
    };

    // For admin role, verify both profile role AND backend admin status
    if (requiredRole === 'admin') {
      if (userProfile?.role !== roleMap[requiredRole]) {
        return <AccessDeniedScreen />;
      }
      
      // Additional backend verification for admin
      if (adminCheckFetched && !isBackendAdmin) {
        return <AccessDeniedScreen />;
      }
    } else {
      // For non-admin roles, profile check is sufficient
      if (userProfile?.role !== roleMap[requiredRole]) {
        return <AccessDeniedScreen />;
      }
    }
  }

  return <>{children}</>;
}
