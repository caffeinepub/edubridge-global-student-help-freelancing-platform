import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../hooks/useAuth';
import { usePageTitle } from '../seo/usePageTitle';
import { toast } from 'sonner';
import { LogIn, Sparkles } from 'lucide-react';
import FloatingShapes from '../components/animation/FloatingShapes';

export default function LoginPage() {
  usePageTitle('Login');
  const navigate = useNavigate();
  const { login, loginStatus, isAuthenticated, userProfile, navigateToDashboard } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await login();
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      setIsLoggingIn(false);
    }
  };

  if (isAuthenticated && userProfile) {
    navigateToDashboard(userProfile.role);
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative overflow-hidden">
      <FloatingShapes />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 animate-gradient" />
      
      <Card className="w-full max-w-md glass-strong border-primary/20 hover:glow-primary transition-all animate-scale-in relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 mx-auto">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Secure Login</span>
          </div>
          <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
          <CardDescription className="text-base">Login to access your EduBridge account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button
            onClick={handleLogin}
            disabled={isLoggingIn || loginStatus === 'logging-in'}
            className="w-full gradient-primary hover:glow-primary transition-all hover:scale-105 text-white group"
            size="lg"
          >
            {isLoggingIn || loginStatus === 'logging-in' ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Logging in...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                Login with Internet Identity
              </>
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Button 
              variant="link" 
              className="p-0 text-primary hover:text-accent transition-colors" 
              onClick={() => navigate({ to: '/create-account' })}
            >
              Create Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
