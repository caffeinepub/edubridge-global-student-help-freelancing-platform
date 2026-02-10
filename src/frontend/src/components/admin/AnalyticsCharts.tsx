import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, CheckCircle, Clock, Star } from 'lucide-react';

interface AnalyticsChartsProps {
  analytics: {
    totalUsers: bigint;
    totalRequests: bigint;
    pendingRequests: bigint;
    acceptedRequests: bigint;
    completedRequests: bigint;
    totalRatings: bigint;
    averageRating: number;
  };
}

export default function AnalyticsCharts({ analytics }: AnalyticsChartsProps) {
  const stats = [
    {
      title: 'Total Users',
      value: Number(analytics.totalUsers),
      icon: Users,
      description: 'Registered users',
    },
    {
      title: 'Total Requests',
      value: Number(analytics.totalRequests),
      icon: FileText,
      description: 'All time requests',
    },
    {
      title: 'Pending',
      value: Number(analytics.pendingRequests),
      icon: Clock,
      description: 'Awaiting helpers',
    },
    {
      title: 'Accepted',
      value: Number(analytics.acceptedRequests),
      icon: CheckCircle,
      description: 'In progress',
    },
    {
      title: 'Completed',
      value: Number(analytics.completedRequests),
      icon: CheckCircle,
      description: 'Finished requests',
    },
    {
      title: 'Average Rating',
      value: analytics.averageRating.toFixed(1),
      icon: Star,
      description: `From ${Number(analytics.totalRatings)} ratings`,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
