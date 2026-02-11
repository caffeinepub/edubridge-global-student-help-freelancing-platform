import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePageTitle } from '../../seo/usePageTitle';
import { useGetAllRequests } from '../../hooks/useAdmin';
import FloatingShapes from '../../components/animation/FloatingShapes';
import { ArrowLeft, MessageSquare, MapPin, Clock, User } from 'lucide-react';
import { RequestStatus } from '../../backend';

export default function OwnerInboxPage() {
  usePageTitle('Owner Inbox');
  const navigate = useNavigate();
  const { data: requests = [], isLoading } = useGetAllRequests();
  const [filter, setFilter] = useState<'all' | RequestStatus>('all');

  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(r => r.status === filter);

  const getStatusBadge = (status: RequestStatus) => {
    const variants = {
      [RequestStatus.pending]: 'default',
      [RequestStatus.accepted]: 'secondary',
      [RequestStatus.completed]: 'outline',
    } as const;

    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
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
            <h1 className="text-4xl font-bold text-gradient">Inbox</h1>
            <p className="text-muted-foreground">View and manage all work requests</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="glass-strong">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                size="sm"
              >
                All ({requests.length})
              </Button>
              <Button
                variant={filter === RequestStatus.pending ? 'default' : 'outline'}
                onClick={() => setFilter(RequestStatus.pending)}
                size="sm"
              >
                Pending ({requests.filter(r => r.status === RequestStatus.pending).length})
              </Button>
              <Button
                variant={filter === RequestStatus.accepted ? 'default' : 'outline'}
                onClick={() => setFilter(RequestStatus.accepted)}
                size="sm"
              >
                Accepted ({requests.filter(r => r.status === RequestStatus.accepted).length})
              </Button>
              <Button
                variant={filter === RequestStatus.completed ? 'default' : 'outline'}
                onClick={() => setFilter(RequestStatus.completed)}
                size="sm"
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
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No requests found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredRequests.map((request) => (
              <Card 
                key={request.id.toString()} 
                className="glass-strong hover:glow-primary transition-all cursor-pointer"
                onClick={() => navigate({ to: `/owner/inbox/${request.id.toString()}` })}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{request.title}</CardTitle>
                        {getStatusBadge(request.status)}
                      </div>
                      <CardDescription className="line-clamp-2">
                        {request.description}
                      </CardDescription>
                    </div>
                    <MessageSquare className="h-5 w-5 text-primary flex-shrink-0" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{request.owner.toString().slice(0, 8)}...</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(Number(request.createdAt) / 1000000).toLocaleDateString()}</span>
                    </div>
                    {request.locationInfo && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{request.locationInfo.city}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
