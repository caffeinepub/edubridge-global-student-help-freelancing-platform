import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
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

const studentRequestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/student-request-help',
  component: () => (
    <ProtectedRoute requiredRole="student">
      <StudentRequestHelpPage />
    </ProtectedRoute>
  ),
});

const freelancingRoute = createRoute({
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
    <ProtectedRoute requiredRole="student">
      <StudentDashboardPage />
    </ProtectedRoute>
  ),
});

const helperDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/helper',
  component: () => (
    <ProtectedRoute requiredRole="helper">
      <HelperDashboardPage />
    </ProtectedRoute>
  ),
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/admin',
  component: () => (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboardPage />
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
  studentRequestRoute,
  freelancingRoute,
  studentDashboardRoute,
  helperDashboardRoute,
  adminDashboardRoute,
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
