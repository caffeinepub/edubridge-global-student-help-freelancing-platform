import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePageTitle } from '../../seo/usePageTitle';
import { useGetAllRequests, useGetAnalytics } from '../../hooks/useAdmin';
import { useGetTelegramConfigStatus } from '../../hooks/useAdmin';
import FloatingShapes from '../../components/animation/FloatingShapes';
import { Inbox, Users, BarChart3, MessageSquare, AlertCircle, CheckCircle2, Send } from 'lucide-react';
import TelegramConfigCard from '../../components/owner/TelegramConfigCard';

export default function OwnerConsolePage() {
  usePageTitle('Owner Console');
  const navigate = useNavigate();
  const { data: requests = [], isLoading: requestsLoading } = useGetAllRequests();
  const { data: analytics, isLoading: analyticsLoading } = useGetAnalytics();
  const { data: telegramStatus } = useGetTelegramConfigStatus();

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const unreadCount = 0; // TODO: Implement unread count across all requests

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 relative overflow-hidden">
      <FloatingShapes />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 animate-gradient" />
      
      <div className="container relative z-10 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gradient">Owner Console</h1>
          <p className="text-muted-foreground text-lg">
            Manage your business, view requests, and communicate with clients
          </p>
        </div>

        {/* Telegram Status Warning */}
        {telegramStatus && !telegramStatus.isConfigured && (
          <Card className="glass-strong border-warning/50 bg-warning/5">
            <CardContent className="flex items-center gap-3 py-4">
              <AlertCircle className="h-5 w-5 text-warning flex-shrink-0" />
              <p className="text-sm text-warning">
                Telegram notifications are not configured. Configure them below to receive instant notifications for new work requests.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass-strong hover:glow-primary transition-all cursor-pointer" onClick={() => navigate({ to: '/owner/inbox' })}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inbox</CardTitle>
              <Inbox className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{requestsLoading ? '...' : requests.length}</div>
              <p className="text-xs text-muted-foreground">
                {pendingRequests.length} pending
              </p>
            </CardContent>
          </Card>

          <Card className="glass-strong hover:glow-secondary transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsLoading ? '...' : Number(analytics?.totalUsers || 0)}
              </div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>

          <Card className="glass-strong hover:glow-accent transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsLoading ? '...' : Number(analytics?.completedRequests || 0)}
              </div>
              <p className="text-xs text-muted-foreground">Finished requests</p>
            </CardContent>
          </Card>

          <Card className="glass-strong hover:glow-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unreadCount}</div>
              <p className="text-xs text-muted-foreground">Unread messages</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-strong border-primary/20 hover:glow-primary transition-all">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Inbox className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Inbox & Requests</CardTitle>
                  <CardDescription>View and manage all work requests</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate({ to: '/owner/inbox' })}
                className="w-full gradient-primary hover:glow-primary"
              >
                Open Inbox
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-strong border-secondary/20 hover:glow-secondary transition-all">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-secondary/10">
                  <BarChart3 className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>View business metrics and insights</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate({ to: '/dashboard/admin' })}
                variant="outline"
                className="w-full"
              >
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Telegram Configuration */}
        <TelegramConfigCard />
      </div>
    </div>
  );
}
