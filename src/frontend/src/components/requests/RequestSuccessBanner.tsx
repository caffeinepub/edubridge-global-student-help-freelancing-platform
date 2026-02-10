import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, ArrowRight, Plus } from 'lucide-react';

interface RequestSuccessBannerProps {
  title?: string;
  description?: string;
  dashboardPath: string;
}

export default function RequestSuccessBanner({
  title = 'Request Submitted Successfully!',
  description = 'Your request has been submitted and is now visible to helpers.',
  dashboardPath,
}: RequestSuccessBannerProps) {
  const navigate = useNavigate();

  return (
    <Card className="max-w-md mx-auto glass-strong border-primary/20 hover:glow-primary transition-all animate-scale-in">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto mb-4 w-20 h-20 rounded-full gradient-primary flex items-center justify-center glow-primary">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Button 
          onClick={() => navigate({ to: dashboardPath })}
          className="gradient-primary hover:glow-primary transition-all hover:scale-105 text-white group"
          size="lg"
        >
          Go to Dashboard
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="glass hover:glass-strong group"
          size="lg"
        >
          <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
          Submit Another Request
        </Button>
      </CardContent>
    </Card>
  );
}
