import { RequestWithTextTasks, RequestStatus } from '../../backend';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, MapPin } from 'lucide-react';
import { useGetUnreadMessageCount } from '../../hooks/useChat';

interface RequestsTableProps {
  requests: RequestWithTextTasks[];
  onSelectRequest?: (request: RequestWithTextTasks) => void;
  showActions?: boolean;
  onAccept?: (requestId: bigint) => void;
  onComplete?: (requestId: bigint) => void;
  showChat?: boolean;
}

function StatusBadge({ status }: { status: RequestStatus }) {
  const variants: Record<RequestStatus, 'default' | 'secondary' | 'outline'> = {
    [RequestStatus.pending]: 'secondary',
    [RequestStatus.accepted]: 'default',
    [RequestStatus.completed]: 'outline',
  };

  return <Badge variant={variants[status]}>{status}</Badge>;
}

function RequestCard({ request, onSelect, showActions, onAccept, onComplete, showChat }: {
  request: RequestWithTextTasks;
  onSelect?: (request: RequestWithTextTasks) => void;
  showActions?: boolean;
  onAccept?: (requestId: bigint) => void;
  onComplete?: (requestId: bigint) => void;
  showChat?: boolean;
}) {
  const { data: unreadCount } = useGetUnreadMessageCount(showChat ? request.id : null);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{request.title}</CardTitle>
            <CardDescription className="mt-1 line-clamp-2">{request.description}</CardDescription>
          </div>
          <StatusBadge status={request.status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {request.locationInfo && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>
                {request.locationInfo.city}, {request.locationInfo.address}
              </span>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {onSelect && (
              <Button variant="outline" size="sm" onClick={() => onSelect(request)}>
                View Details
              </Button>
            )}
            {showActions && request.status === RequestStatus.pending && onAccept && (
              <Button size="sm" onClick={() => onAccept(request.id)}>
                Accept Request
              </Button>
            )}
            {showActions && request.status === RequestStatus.accepted && onComplete && (
              <Button size="sm" onClick={() => onComplete(request.id)}>
                Mark Complete
              </Button>
            )}
            {showChat && request.assignedHelper && (
              <Button variant="outline" size="sm" onClick={() => onSelect?.(request)}>
                <MessageSquare className="h-4 w-4 mr-1" />
                Chat
                {unreadCount && Number(unreadCount) > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 px-1.5">
                    {Number(unreadCount)}
                  </Badge>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RequestsTable({
  requests,
  onSelectRequest,
  showActions,
  onAccept,
  onComplete,
  showChat,
}: RequestsTableProps) {
  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          No requests found
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {requests.map((request) => (
        <RequestCard
          key={request.id.toString()}
          request={request}
          onSelect={onSelectRequest}
          showActions={showActions}
          onAccept={onAccept}
          onComplete={onComplete}
          showChat={showChat}
        />
      ))}
    </div>
  );
}
