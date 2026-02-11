import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet, Navigate } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';
import StudentRequestHelpPage from './pages/StudentRequestHelpPage';
import FreelancingHelpPage from './pages/FreelancingHelpPage';
import StudentDashboardPage from './pages/dashboards/StudentDashboardPage';
import HelperDashboardPage from './pages/dashboards/HelperDashboardPage';
import AdminDashboardPage from './pages/dashboards/AdminDashboardPage';
import WorkRequestPage from './pages/WorkRequestPage';
import OwnerConsolePage from './pages/owner/OwnerConsolePage';
import OwnerInboxPage from './pages/owner/OwnerInboxPage';
import OwnerRequestDetailPage from './pages/owner/OwnerRequestDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './routes/ProtectedRoute';

const rootRoute = createRootRoute({
  component: () => (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AppLayout>
        <Outlet />
      </AppLayout>
      <Toaster />
    </ThemeProvider>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const createAccountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create-account',
  component: CreateAccountPage,
});

// New work request route for authenticated non-admin users
const workRequestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/work-request',
  component: () => (
    <ProtectedRoute nonAdminOnly>
      <WorkRequestPage />
    </ProtectedRoute>
  ),
});

// Redirect old routes to new work request route
const requestHelpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/request-help',
  component: () => <Navigate to="/work-request" />,
});

const studentRequestRedirectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/student-request-help',
  component: () => <Navigate to="/work-request" />,
});

const freelancingHelpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/freelancing-help',
  component: () => (
    <ProtectedRoute>
      <FreelancingHelpPage />
    </ProtectedRoute>
  ),
});

const studentDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/student',
  component: () => (
    <ProtectedRoute>
      <StudentDashboardPage />
    </ProtectedRoute>
  ),
});

const helperDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/helper',
  component: () => (
    <ProtectedRoute>
      <HelperDashboardPage />
    </ProtectedRoute>
  ),
});

// Redirect admin dashboard to owner console
const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/admin',
  component: () => <Navigate to="/owner" />,
});

// Owner Console routes (admin-only)
const ownerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/owner',
  component: () => (
    <ProtectedRoute requiredRole="admin">
      <OwnerConsolePage />
    </ProtectedRoute>
  ),
});

const ownerInboxRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/owner/inbox',
  component: () => (
    <ProtectedRoute requiredRole="admin">
      <OwnerInboxPage />
    </ProtectedRoute>
  ),
});

const ownerRequestDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/owner/inbox/$requestId',
  component: () => (
    <ProtectedRoute requiredRole="admin">
      <OwnerRequestDetailPage />
    </ProtectedRoute>
  ),
});

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
  component: NotFoundPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  createAccountRoute,
  workRequestRoute,
  requestHelpRoute,
  studentRequestRedirectRoute,
  freelancingHelpRoute,
  studentDashboardRoute,
  helperDashboardRoute,
  adminDashboardRoute,
  ownerRoute,
  ownerInboxRoute,
  ownerRequestDetailRoute,
  notFoundRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
