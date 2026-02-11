import { ReactNode } from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Menu, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { UserRole } from '../../backend';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, logout, userProfile } = useAuth();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isLandingPage = currentPath === '/';

  // Helper to check if user is admin
  const isAdmin = userProfile?.role === UserRole.admin;

  const NavLinks = () => (
    <>
      {isAuthenticated && userProfile && (
        <>
          {/* Admin/Owner gets Owner Console link */}
          {isAdmin && (
            <Button 
              variant="ghost" 
              onClick={() => navigate({ to: '/owner' })}
              className="hover:bg-primary/10 transition-colors"
            >
              Owner Console
            </Button>
          )}

          {/* Non-admin users get Work Request link */}
          {!isAdmin && (
            <Button 
              variant="ghost" 
              onClick={() => navigate({ to: '/work-request' })}
              className="hover:bg-primary/10 transition-colors"
            >
              Work Request
            </Button>
          )}

          {/* Role-specific dashboard links for non-admin users */}
          {userProfile.role === UserRole.student && (
            <Button 
              variant="ghost" 
              onClick={() => navigate({ to: '/dashboard/student' })}
              className="hover:bg-primary/10 transition-colors"
            >
              My Dashboard
            </Button>
          )}
          {(userProfile.role === UserRole.helper || userProfile.role === UserRole.business) && (
            <>
              <Button 
                variant="ghost" 
                onClick={() => navigate({ to: '/dashboard/helper' })}
                className="hover:bg-primary/10 transition-colors"
              >
                My Dashboard
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate({ to: '/freelancing-help' })}
                className="hover:bg-primary/10 transition-colors"
              >
                Find Work
              </Button>
            </>
          )}
        </>
      )}
    </>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b glass-strong">
        <div className="container flex h-16 items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => navigate({ to: '/' })}
          >
            <div className="relative">
              <img 
                src="/assets/generated/edubridge-logo.dim_512x512.png" 
                alt="EduBridge" 
                className="h-10 w-10 transition-transform group-hover:scale-110" 
              />
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="font-bold text-xl text-gradient">
              EduBridge
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            <NavLinks />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="ml-2 hover:bg-primary/10 transition-all hover:scale-110"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            {isAuthenticated ? (
              <Button 
                onClick={logout} 
                variant="outline" 
                className="ml-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-all"
              >
                Logout
              </Button>
            ) : (
              !isLandingPage && (
                <Button 
                  onClick={() => navigate({ to: '/login' })} 
                  className="ml-2 gradient-primary hover:glow-primary transition-all"
                >
                  Login
                </Button>
              )
            )}
          </nav>

          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="hover:bg-primary/10 transition-all"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="glass-strong">
                <nav className="flex flex-col gap-4 mt-8">
                  <NavLinks />
                  {isAuthenticated ? (
                    <Button onClick={logout} variant="outline" className="w-full">
                      Logout
                    </Button>
                  ) : (
                    !isLandingPage && (
                      <Button onClick={() => navigate({ to: '/login' })} className="w-full gradient-primary">
                        Login
                      </Button>
                    )
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t glass py-8 mt-auto">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src="/assets/generated/edubridge-logo.dim_512x512.png" alt="EduBridge" className="h-8 w-8" />
              <span className="font-semibold text-gradient">EduBridge</span>
            </div>
            
            <div className="text-sm text-muted-foreground text-center">
              © {new Date().getFullYear()} EduBridge. All rights reserved.
            </div>

            <div className="text-sm text-muted-foreground">
              Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'edubridge'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-accent transition-colors font-medium"
              >
                caffeine.ai
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
