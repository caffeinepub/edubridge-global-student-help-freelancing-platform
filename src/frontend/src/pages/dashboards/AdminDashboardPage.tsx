import { useGetAllUsers, useGetAllRequests, useGetAnalytics, useDeleteUser, useDeleteRequest } from '../../hooks/useAdmin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import AnalyticsCharts from '../../components/admin/AnalyticsCharts';
import { usePageTitle } from '../../seo/usePageTitle';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

export default function AdminDashboardPage() {
  usePageTitle('Admin Dashboard');
  const { data: users = [], isLoading: loadingUsers } = useGetAllUsers();
  const { data: requests = [], isLoading: loadingRequests } = useGetAllRequests();
  const { data: analytics, isLoading: loadingAnalytics } = useGetAnalytics();
  const deleteUserMutation = useDeleteUser();
  const deleteRequestMutation = useDeleteRequest();

  const handleDeleteUser = async (principal: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await deleteUserMutation.mutateAsync(principal as any);
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleDeleteRequest = async (requestId: bigint) => {
    if (!confirm('Are you sure you want to delete this request?')) return;

    try {
      await deleteRequestMutation.mutateAsync(requestId);
      toast.success('Request deleted successfully');
    } catch (error) {
      toast.error('Failed to delete request');
    }
  };

  if (loadingUsers || loadingRequests || loadingAnalytics) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage users, requests, and view platform analytics</p>
        </div>

        {analytics && <AnalyticsCharts analytics={analytics} />}

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
            <TabsTrigger value="requests">Requests ({requests.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage all registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Principal</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map(([principal, profile]) => (
                      <TableRow key={principal.toString()}>
                        <TableCell className="font-medium">{profile.name}</TableCell>
                        <TableCell>
                          <Badge>{profile.role}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{principal.toString().slice(0, 20)}...</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(principal.toString())}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>Request Management</CardTitle>
                <CardDescription>View and manage all help requests</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow key={request.id.toString()}>
                        <TableCell className="font-medium">{request.title}</TableCell>
                        <TableCell>
                          <Badge>{request.status}</Badge>
                        </TableCell>
                        <TableCell>
                          {request.locationInfo ? `${request.locationInfo.city}` : 'Online'}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRequest(request.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
