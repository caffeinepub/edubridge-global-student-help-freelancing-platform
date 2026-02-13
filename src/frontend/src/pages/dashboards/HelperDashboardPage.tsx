import { useState } from 'react';
import { useGetAvailableRequests, useGetMyAssignedRequests } from '../../hooks/useRequests';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RequestsTable from '../../components/requests/RequestsTable';
import RequestsFilters from '../../components/requests/RequestsFilters';
import ChatPanel from '../../components/chat/ChatPanel';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { RequestWithTextTasks } from '../../backend';
import { usePageTitle } from '../../seo/usePageTitle';
import { Briefcase, Search, CheckCircle2 } from 'lucide-react';

export default function HelperDashboardPage() {
  usePageTitle('Helper Dashboard');
  const { data: availableRequests = [], isLoading: loadingAvailable } = useGetAvailableRequests();
  const { data: assignedRequests = [], isLoading: loadingAssigned } = useGetMyAssignedRequests();

  const [selectedRequest, setSelectedRequest] = useState<RequestWithTextTasks | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [offlineOnly, setOfflineOnly] = useState(false);
  const [cityFilter, setCityFilter] = useState('');

  const filterRequests = (requests: RequestWithTextTasks[]) => {
    return requests.filter((req) => {
      const matchesSearch =
        req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesOffline = !offlineOnly || req.locationInfo !== undefined;
      const matchesCity = !cityFilter || req.locationInfo?.city.toLowerCase().includes(cityFilter.toLowerCase());

      return matchesSearch && matchesOffline && matchesCity;
    });
  };

  const filteredAvailable = filterRequests(availableRequests);
  const filteredAssigned = filterRequests(assignedRequests);

  const handleSelectRequest = (request: RequestWithTextTasks) => {
    setSelectedRequest(request);
    setShowChat(true);
  };

  if (loadingAvailable || loadingAssigned) {
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
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gradient">Helper Dashboard</h1>
            </div>
            <p className="text-muted-foreground text-lg">Browse available requests and manage your accepted tasks</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="glass hover:glass-strong hover-lift border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Available Requests</CardTitle>
              <Search className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gradient">{filteredAvailable.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Ready to view</p>
            </CardContent>
          </Card>

          <Card className="glass hover:glass-strong hover-lift border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">My Tasks</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gradient">{filteredAssigned.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Currently working on</p>
            </CardContent>
          </Card>
        </div>

        <RequestsFilters
          onSearchChange={setSearchTerm}
          onOfflineOnlyChange={setOfflineOnly}
          onCityChange={setCityFilter}
        />

        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="glass">
            <TabsTrigger value="available" className="data-[state=active]:gradient-primary data-[state=active]:text-white">
              Available ({filteredAvailable.length})
            </TabsTrigger>
            <TabsTrigger value="assigned" className="data-[state=active]:gradient-primary data-[state=active]:text-white">
              My Tasks ({filteredAssigned.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-4">
            <RequestsTable
              requests={filteredAvailable}
              onSelectRequest={handleSelectRequest}
            />
          </TabsContent>

          <TabsContent value="assigned" className="space-y-4">
            <RequestsTable
              requests={filteredAssigned}
              onSelectRequest={handleSelectRequest}
              showChat={true}
            />
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showChat} onOpenChange={setShowChat}>
        <DialogContent className="max-w-2xl glass-strong">
          {selectedRequest && <ChatPanel requestId={selectedRequest.id} requestTitle={selectedRequest.title} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
