import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGetMyRequests } from '../../hooks/useRequests';
import { useAuth } from '../../hooks/useAuth';
import { usePageTitle } from '../../seo/usePageTitle';
import { RequestStatus, RequestWithTextTasks } from '../../backend';
import { FileText, CheckCircle, Clock, XCircle, MessageSquare, MapPin } from 'lucide-react';
import ChatPanel from '../../components/chat/ChatPanel';
import FloatingShapes from '../../components/animation/FloatingShapes';
import { useGetUnreadMessageCount } from '../../hooks/useChat';

export default function StudentDashboardPage() {
  usePageTitle('Student Dashboard');
  const { userProfile } = useAuth();
  const { data: requests = [], isLoading } = useGetMyRequests();
  const [selectedRequest, setSelectedRequest] = useState<RequestWithTextTasks | null>(null);

  const pendingRequests = requests.filter(r => r.status === RequestStatus.pending);
  const acceptedRequests = requests.filter(r => r.status === RequestStatus.accepted);
  const completedRequests = requests.filter(r => r.status === RequestStatus.completed);
  const rejectedRequests = requests.filter(r => r.status === RequestStatus.rejected);

  const stats = [
    { label: 'Total Requests', value: requests.length, icon: FileText, color: 'text-primary' },
    { label: 'Pending', value: pendingRequests.length, icon: Clock, color: 'text-yellow-500' },
    { label: 'Accepted', value: acceptedRequests.length, icon: CheckCircle, color: 'text-green-500' },
    { label: 'Completed', value: completedRequests.length, icon: CheckCircle, color: 'text-blue-500' },
  ];

  function RequestCard({ request }: { request: RequestWithTextTasks }) {
    const { data: unreadCount } = useGetUnreadMessageCount(request.id);
    const hasUnread = unreadCount && Number(unreadCount) > 0;

    const getStatusBadge = (status: RequestStatus) => {
      const config = {
        [RequestStatus.pending]: { variant: 'secondary' as const, label: 'Pending' },
        [RequestStatus.accepted]: { variant: 'default' as const, label: 'Accepted' },
        [RequestStatus.completed]: { variant: 'outline' as const, label: 'Completed' },
        [RequestStatus.rejected]: { variant: 'destructive' as const, label: 'Rejected' },
      };
      const statusConfig = config[status] || { variant: 'default' as const, label: String(status) };
      return <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>;
    };

    const showNotification = request.status === RequestStatus.accepted || request.status === RequestStatus.rejected;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{request.title}</CardTitle>
              <CardDescription className="mt-1 line-clamp-2">{request.description}</CardDescription>
            </div>
            {getStatusBadge(request.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {showNotification && (
              <div className={`p-3 rounded-lg text-sm ${
                request.status === RequestStatus.accepted 
                  ? 'bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20'
                  : 'bg-destructive/10 text-destructive border border-destructive/20'
              }`}>
                {request.status === RequestStatus.accepted 
                  ? '✓ Your request has been accepted! We will get back to you soon.'
                  : '✗ Unfortunately, your request has been rejected. Please feel free to submit another request with more details or try again later.'}
              </div>
            )}
            {request.locationInfo && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>
                  {request.locationInfo.city}, {request.locationInfo.address}
                </span>
              </div>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedRequest(request)}
              className="relative"
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Chat
              {hasUnread && (
                <Badge variant="destructive" className="ml-2 h-5 px-1.5">
                  {Number(unreadCount)}
                </Badge>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (selectedRequest) {
    return (
      <div className="min-h-[calc(100vh-4rem)] py-12 relative overflow-hidden">
        <FloatingShapes />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 animate-gradient" />
        
        <div className="container relative z-10">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedRequest(null)}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <ChatPanel 
            requestId={selectedRequest.id} 
            requestTitle={selectedRequest.title}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 relative overflow-hidden">
      <FloatingShapes />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 animate-gradient" />
      
      <div className="container relative z-10 space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gradient">Welcome, {userProfile?.name}!</h1>
          <p className="text-muted-foreground text-lg">Manage your help requests and track progress</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="glass hover:glass-strong transition-all">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="glass">
            <TabsTrigger value="all">All Requests</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {requests.length === 0 ? (
              <Card className="glass-strong">
                <CardContent className="py-12 text-center text-muted-foreground">
                  No requests yet. Create your first request to get started!
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {requests.map(request => (
                  <RequestCard key={request.id.toString()} request={request} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {pendingRequests.length === 0 ? (
              <Card className="glass-strong">
                <CardContent className="py-12 text-center text-muted-foreground">
                  No pending requests
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pendingRequests.map(request => (
                  <RequestCard key={request.id.toString()} request={request} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="accepted" className="space-y-4">
            {acceptedRequests.length === 0 ? (
              <Card className="glass-strong">
                <CardContent className="py-12 text-center text-muted-foreground">
                  No accepted requests
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {acceptedRequests.map(request => (
                  <RequestCard key={request.id.toString()} request={request} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            {rejectedRequests.length === 0 ? (
              <Card className="glass-strong">
                <CardContent className="py-12 text-center text-muted-foreground">
                  No rejected requests
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {rejectedRequests.map(request => (
                  <RequestCard key={request.id.toString()} request={request} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedRequests.length === 0 ? (
              <Card className="glass-strong">
                <CardContent className="py-12 text-center text-muted-foreground">
                  No completed requests
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {completedRequests.map(request => (
                  <RequestCard key={request.id.toString()} request={request} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
