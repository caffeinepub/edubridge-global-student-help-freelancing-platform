import { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from '@tanstack/react-router';
import { UserRole } from '../backend';
import AccessDeniedScreen from '../components/auth/AccessDeniedScreen';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'student' | 'helper' | 'business' | 'admin';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isProfileReady, profileLoading, userProfile } = useAuth();

  if (profileLoading) {
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

  if (requiredRole) {
    const roleMap: Record<string, UserRole> = {
      student: UserRole.student,
      helper: UserRole.helper,
      business: UserRole.business,
      admin: UserRole.admin,
    };

    if (userProfile?.role !== roleMap[requiredRole]) {
      return <AccessDeniedScreen />;
    }
  }

  return <>{children}</>;
}
