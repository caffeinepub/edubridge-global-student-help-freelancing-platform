import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePageTitle } from '../../seo/usePageTitle';
import { useGetAllRequests } from '../../hooks/useAdmin';
import FloatingShapes from '../../components/animation/FloatingShapes';
import { ArrowLeft, MessageSquare, MapPin, Clock, User, Globe } from 'lucide-react';
import { RequestStatus, SubmissionMode } from '../../backend';

export default function OwnerInboxPage() {
  usePageTitle('Owner Inbox');
  const navigate = useNavigate();
  const { data: requests = [], isLoading } = useGetAllRequests();
  const [filter, setFilter] = useState<'all' | RequestStatus>('all');

  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(r => r.status === filter);

  const getStatusBadge = (status: RequestStatus) => {
    const config = {
      [RequestStatus.pending]: { variant: 'default' as const, label: 'Pending' },
      [RequestStatus.accepted]: { variant: 'secondary' as const, label: 'Accepted' },
      [RequestStatus.completed]: { variant: 'outline' as const, label: 'Completed' },
      [RequestStatus.rejected]: { variant: 'destructive' as const, label: 'Rejected' },
    };

    const statusConfig = config[status] || { variant: 'default' as const, label: String(status) };

    return (
      <Badge variant={statusConfig.variant}>
        {statusConfig.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 relative overflow-hidden">
      <FloatingShapes />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 animate-gradient" />
      
      <div className="container relative z-10 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: '/owner' })}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-gradient">Owner Inbox</h1>
            <p className="text-muted-foreground text-lg">Review and manage all work requests</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <Card className="glass-strong">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'gradient-primary text-white' : ''}
              >
                All ({requests.length})
              </Button>
              <Button
                variant={filter === RequestStatus.pending ? 'default' : 'outline'}
                onClick={() => setFilter(RequestStatus.pending)}
                className={filter === RequestStatus.pending ? 'gradient-primary text-white' : ''}
              >
                Pending ({requests.filter(r => r.status === RequestStatus.pending).length})
              </Button>
              <Button
                variant={filter === RequestStatus.accepted ? 'default' : 'outline'}
                onClick={() => setFilter(RequestStatus.accepted)}
                className={filter === RequestStatus.accepted ? 'gradient-primary text-white' : ''}
              >
                Accepted ({requests.filter(r => r.status === RequestStatus.accepted).length})
              </Button>
              <Button
                variant={filter === RequestStatus.rejected ? 'default' : 'outline'}
                onClick={() => setFilter(RequestStatus.rejected)}
                className={filter === RequestStatus.rejected ? 'gradient-primary text-white' : ''}
              >
                Rejected ({requests.filter(r => r.status === RequestStatus.rejected).length})
              </Button>
              <Button
                variant={filter === RequestStatus.completed ? 'default' : 'outline'}
                onClick={() => setFilter(RequestStatus.completed)}
                className={filter === RequestStatus.completed ? 'gradient-primary text-white' : ''}
              >
                Completed ({requests.filter(r => r.status === RequestStatus.completed).length})
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Requests List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <Card className="glass-strong">
            <CardContent className="py-12 text-center text-muted-foreground">
              No requests found
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredRequests.map((request) => (
              <Card
                key={request.id.toString()}
                className="glass hover:glass-strong hover-lift cursor-pointer transition-all"
                onClick={() => navigate({ to: '/owner/inbox/$requestId', params: { requestId: request.id.toString() } })}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{request.title}</CardTitle>
                      <CardDescription className="mt-1 line-clamp-2">{request.description}</CardDescription>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="font-mono truncate">{request.owner.toString().slice(0, 20)}...</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {request.submissionMode === SubmissionMode.online ? (
                      <>
                        <Globe className="h-4 w-4 text-primary" />
                        <span className="text-primary font-medium">Online</span>
                      </>
                    ) : (
                      <>
                        <MapPin className="h-4 w-4 text-accent" />
                        <span className="text-accent font-medium">Offline</span>
                      </>
                    )}
                  </div>
                  {request.submissionMode === SubmissionMode.offline && request.submissionLocation && (
                    <div className="text-xs text-muted-foreground bg-accent/10 p-2 rounded">
                      <MapPin className="h-3 w-3 inline mr-1" />
                      {request.submissionLocation}
                    </div>
                  )}
                  {request.locationInfo && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{request.locationInfo.city}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(Number(request.createdAt) / 1000000).toLocaleDateString()}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate({ to: '/owner/inbox/$requestId', params: { requestId: request.id.toString() } });
                    }}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    View & Chat
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
