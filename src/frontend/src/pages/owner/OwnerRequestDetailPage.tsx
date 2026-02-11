import { useParams, useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePageTitle } from '../../seo/usePageTitle';
import { useGetAllRequests } from '../../hooks/useAdmin';
import ChatPanel from '../../components/chat/ChatPanel';
import FloatingShapes from '../../components/animation/FloatingShapes';
import { ArrowLeft, MapPin, Clock, User, CheckCircle2 } from 'lucide-react';
import { RequestStatus } from '../../backend';

export default function OwnerRequestDetailPage() {
  const { requestId } = useParams({ from: '/owner/inbox/$requestId' });
  const navigate = useNavigate();
  const { data: requests = [], isLoading } = useGetAllRequests();

  const request = requests.find(r => r.id.toString() === requestId);

  usePageTitle(request ? `Request: ${request.title}` : 'Request Details');

  const getStatusBadge = (status: RequestStatus) => {
    const variants = {
      pending: 'default',
      accepted: 'secondary',
      completed: 'outline',
    } as const;

    return (
      <Badge variant={variants[status]} className="text-sm">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-[calc(100vh-4rem)] py-12 relative overflow-hidden">
        <FloatingShapes />
        <div className="container relative z-10">
          <Card className="glass-strong">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Request not found</p>
              <Button 
                onClick={() => navigate({ to: '/owner/inbox' })}
                className="mt-4"
              >
                Back to Inbox
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 relative overflow-hidden">
      <FloatingShapes />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 animate-gradient" />
      
      <div className="container relative z-10 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: '/owner/inbox' })}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gradient">{request.title}</h1>
            <p className="text-muted-foreground">Request Details</p>
          </div>
          {getStatusBadge(request.status)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Request Details */}
          <div className="space-y-6">
            <Card className="glass-strong">
              <CardHeader>
                <CardTitle>Request Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                  <p className="text-sm">{request.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                    {getStatusBadge(request.status)}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Created</h3>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(Number(request.createdAt) / 1000000).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Requester</h3>
                  <div className="flex items-center gap-1 text-sm">
                    <User className="h-4 w-4" />
                    <span className="font-mono">{request.owner.toString()}</span>
                  </div>
                </div>

                {request.locationInfo && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Location</h3>
                    <div className="flex items-start gap-1 text-sm">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{request.locationInfo.city}</p>
                        <p className="text-muted-foreground">{request.locationInfo.address}</p>
                      </div>
                    </div>
                  </div>
                )}

                {request.assignedHelper && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Assigned Helper</h3>
                    <div className="flex items-center gap-1 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      <span className="font-mono">{request.assignedHelper.toString()}</span>
                    </div>
                  </div>
                )}

                {request.tasks.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Tasks</h3>
                    <ul className="space-y-1">
                      {request.tasks.map((task, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Chat Panel */}
          <div>
            <ChatPanel requestId={request.id} requestTitle={request.title} />
          </div>
        </div>
      </div>
    </div>
  );
}
