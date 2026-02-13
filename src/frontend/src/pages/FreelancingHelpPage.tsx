import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateRequest } from '../hooks/useRequests';
import { useAuth } from '../hooks/useAuth';
import RequestSuccessBanner from '../components/requests/RequestSuccessBanner';
import { usePageTitle } from '../seo/usePageTitle';
import { toast } from 'sonner';
import { Send, Sparkles } from 'lucide-react';
import FloatingShapes from '../components/animation/FloatingShapes';
import { getHelpRequestErrorMessage } from '../utils/helpRequestErrors';
import { UserRole, SubmissionMode } from '../backend';

export default function FreelancingHelpPage() {
  usePageTitle('Freelancing Help');
  const [submitted, setSubmitted] = useState(false);
  const createRequestMutation = useCreateRequest();
  const { userProfile, isAuthenticated, isProfileReady } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const canSubmitRequest = isAuthenticated && isProfileReady && 
    (userProfile?.role === UserRole.student || userProfile?.role === UserRole.business);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check authentication
    if (!isAuthenticated) {
      toast.error('Please log in to submit a help request.');
      return;
    }

    // Check if profile is ready
    if (!isProfileReady || !userProfile) {
      toast.error('Please complete your profile setup first.');
      return;
    }

    // Check role permission
    if (!canSubmitRequest) {
      toast.error('You do not have permission to submit help requests. Only students and businesses can create requests.');
      return;
    }

    if (!formData.title || !formData.description) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await createRequestMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        location: null,
        submissionMode: SubmissionMode.online,
      });
      setSubmitted(true);
    } catch (error) {
      const errorMessage = getHelpRequestErrorMessage(error);
      toast.error(errorMessage);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-4rem)] py-12 relative overflow-hidden">
        <FloatingShapes />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 animate-gradient" />
        <div className="container relative z-10">
          <RequestSuccessBanner
            title="Help Request Submitted!"
            description="Your request has been posted and helpers will be able to see it."
            dashboardPath="/dashboard/student"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 relative overflow-hidden">
      <FloatingShapes />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 animate-gradient" />
      
      <div className="container max-w-2xl relative z-10">
        <Card className="glass-strong border-primary/20 hover:glow-primary transition-all animate-scale-in">
          <CardHeader className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 mx-auto">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Freelancing</span>
            </div>
            <CardTitle className="text-3xl font-bold">Request Freelancing Help</CardTitle>
            <CardDescription className="text-base">
              Describe the help you need and connect with skilled freelancers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">Title *</Label>
                <Input
                  id="title"
                  placeholder="Brief title for your help request"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="glass focus-glow transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of the help you need..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={10}
                  required
                  className="glass focus-glow transition-all resize-none"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full gradient-primary hover:glow-primary transition-all hover:scale-105 text-white group" 
                size="lg" 
                disabled={createRequestMutation.isPending}
              >
                {createRequestMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    Submit Help Request
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
