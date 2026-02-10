import { useState } from 'react';
import { useGetMyRequests } from '../../hooks/useRequests';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RequestsTable from '../../components/requests/RequestsTable';
import RequestsFilters from '../../components/requests/RequestsFilters';
import ChatPanel from '../../components/chat/ChatPanel';
import RatingDialog from '../../components/ratings/RatingDialog';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { RequestWithTextTasks, RequestStatus } from '../../backend';
import { usePageTitle } from '../../seo/usePageTitle';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Clock, CheckCircle2, Sparkles } from 'lucide-react';

export default function StudentDashboardPage() {
  usePageTitle('Student Dashboard');
  const { data: requests = [], isLoading } = useGetMyRequests();
  const [selectedRequest, setSelectedRequest] = useState<RequestWithTextTasks | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRequests = requests.filter((req) =>
    req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingRequests = filteredRequests.filter((r) => r.status === RequestStatus.pending);
  const acceptedRequests = filteredRequests.filter((r) => r.status === RequestStatus.accepted);
  const completedRequests = filteredRequests.filter((r) => r.status === RequestStatus.completed);

  const handleSelectRequest = (request: RequestWithTextTasks) => {
    setSelectedRequest(request);
    if (request.assignedHelper) {
      setShowChat(true);
    }
  };

  const handleRateHelper = (request: RequestWithTextTasks) => {
    setSelectedRequest(request);
    setShowRating(true);
  };

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl gradient-primary">
                <LayoutDashboard className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gradient">Student Dashboard</h1>
            </div>
            <p className="text-muted-foreground text-lg">Manage your help requests and chat with helpers</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="glass hover:glass-strong hover-lift border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gradient">{pendingRequests.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting helper</p>
            </CardContent>
          </Card>

          <Card className="glass hover:glass-strong hover-lift border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Sparkles className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gradient">{acceptedRequests.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Being worked on</p>
            </CardContent>
          </Card>

          <Card className="glass hover:glass-strong hover-lift border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gradient">{completedRequests.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Successfully finished</p>
            </CardContent>
          </Card>
        </div>

        <RequestsFilters
          onSearchChange={setSearchTerm}
          onOfflineOnlyChange={() => {}}
          onCityChange={() => {}}
          showLocationFilters={false}
        />

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="glass">
            <TabsTrigger value="all" className="data-[state=active]:gradient-primary data-[state=active]:text-white">
              All ({filteredRequests.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:gradient-primary data-[state=active]:text-white">
              Pending ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="accepted" className="data-[state=active]:gradient-primary data-[state=active]:text-white">
              Accepted ({acceptedRequests.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:gradient-primary data-[state=active]:text-white">
              Completed ({completedRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <RequestsTable
              requests={filteredRequests}
              onSelectRequest={handleSelectRequest}
              showChat={true}
            />
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <RequestsTable requests={pendingRequests} onSelectRequest={handleSelectRequest} />
          </TabsContent>

          <TabsContent value="accepted" className="space-y-4">
            <RequestsTable
              requests={acceptedRequests}
              onSelectRequest={handleSelectRequest}
              showChat={true}
            />
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <div className="space-y-4">
              {completedRequests.map((request) => (
                <Card key={request.id.toString()} className="glass hover:glass-strong hover-lift border-primary/10">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{request.title}</CardTitle>
                        <CardDescription className="mt-2">{request.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleSelectRequest(request)}
                        className="glass hover:glass-strong"
                      >
                        View Details
                      </Button>
                      {request.assignedHelper && (
                        <Button 
                          size="sm" 
                          onClick={() => handleRateHelper(request)}
                          className="gradient-primary hover:glow-primary text-white"
                        >
                          Rate Helper
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {completedRequests.length === 0 && (
                <Card className="glass border-primary/10">
                  <CardContent className="py-12 text-center text-muted-foreground">
                    No completed requests yet
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showChat} onOpenChange={setShowChat}>
        <DialogContent className="max-w-2xl glass-strong">
          {selectedRequest && <ChatPanel requestId={selectedRequest.id} requestTitle={selectedRequest.title} />}
        </DialogContent>
      </Dialog>

      {selectedRequest?.assignedHelper && (
        <RatingDialog
          open={showRating}
          onOpenChange={setShowRating}
          requestId={selectedRequest.id}
          helperPrincipal={selectedRequest.assignedHelper}
          onSuccess={() => setShowRating(false)}
        />
      )}
    </div>
  );
}
