import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCreateRequest } from '../hooks/useRequests';
import { useAuth } from '../hooks/useAuth';
import RequestSuccessBanner from '../components/requests/RequestSuccessBanner';
import { usePageTitle } from '../seo/usePageTitle';
import { toast } from 'sonner';
import { Send, Sparkles, MapPin, Globe } from 'lucide-react';
import FloatingShapes from '../components/animation/FloatingShapes';
import { getHelpRequestErrorMessage } from '../utils/helpRequestErrors';
import { UserRole, SubmissionMode } from '../backend';

export default function WorkRequestPage() {
  usePageTitle('Submit Work Request');
  const createRequestMutation = useCreateRequest();
  const { userProfile, isAuthenticated, isProfileReady } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    title: '',
    description: '',
    submissionMode: 'online' as 'online' | 'offline',
    city: '',
    address: '',
  });

  const canSubmitRequest = isAuthenticated && isProfileReady && 
    (userProfile?.role === UserRole.student || 
     userProfile?.role === UserRole.business || 
     userProfile?.role === UserRole.client);

  const getRoleSpecificHelperText = () => {
    if (!userProfile) return '';
    
    switch (userProfile.role) {
      case UserRole.student:
        return 'Title of work (e.g., assignment, homework)';
      case UserRole.client:
        return 'Title of work requested (e.g., freelancing task)';
      case UserRole.business:
        return 'Title of service/product';
      default:
        return 'Brief description of your request';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check authentication
    if (!isAuthenticated) {
      toast.error('Please log in to submit a work request.');
      return;
    }

    // Check if profile is ready
    if (!isProfileReady || !userProfile) {
      toast.error('Please complete your profile setup first.');
      return;
    }

    // Check role permission
    if (!canSubmitRequest) {
      toast.error('You do not have permission to submit work requests.');
      return;
    }

    if (!formData.name || !formData.age || !formData.title || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.submissionMode === 'offline' && (!formData.city || !formData.address)) {
      toast.error('Please provide location details for offline help');
      return;
    }

    try {
      const location = formData.submissionMode === 'offline'
        ? { city: formData.city, address: formData.address }
        : null;

      const mode = formData.submissionMode === 'offline' ? SubmissionMode.offline : SubmissionMode.online;

      await createRequestMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        location,
        submissionMode: mode,
      });

      setShowSuccess(true);
      setFormData({
        name: '',
        age: '',
        title: '',
        description: '',
        submissionMode: 'online',
        city: '',
        address: '',
      });
    } catch (error) {
      const errorMessage = getHelpRequestErrorMessage(error);
      toast.error(errorMessage);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-[calc(100vh-4rem)] py-12 relative overflow-hidden">
        <FloatingShapes />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 animate-gradient" />
        <div className="container relative z-10">
          <RequestSuccessBanner
            title="Work Request Submitted Successfully!"
            description="Your request has been submitted and the owner will be notified via Telegram."
            dashboardPath={
              userProfile?.role === UserRole.student 
                ? '/dashboard/student' 
                : '/work-request'
            }
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
              <span className="text-sm font-medium text-primary">Submit Request</span>
            </div>
            <CardTitle className="text-3xl font-bold">Submit Work Request</CardTitle>
            <CardDescription className="text-base">
              Describe what you need help with and the owner will be notified
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your full name"
                  required
                  className="glass focus-glow transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="text-sm font-medium">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="Your age"
                  required
                  className="glass focus-glow transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={getRoleSpecificHelperText()}
                  required
                  className="glass focus-glow transition-all"
                />
                <p className="text-xs text-muted-foreground">{getRoleSpecificHelperText()}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide detailed information about what you need help with..."
                  rows={6}
                  required
                  className="glass focus-glow transition-all resize-none"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Submission Mode *</Label>
                <RadioGroup
                  value={formData.submissionMode}
                  onValueChange={(value) => setFormData({ ...formData, submissionMode: value as 'online' | 'offline' })}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-3 p-4 rounded-lg glass hover:glass-strong transition-all cursor-pointer">
                    <RadioGroupItem value="online" id="online" />
                    <div className="flex items-center gap-2 flex-1">
                      <Globe className="h-4 w-4 text-primary" />
                      <Label htmlFor="online" className="cursor-pointer font-medium">
                        Online
                      </Label>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-lg glass hover:glass-strong transition-all cursor-pointer">
                    <RadioGroupItem value="offline" id="offline" />
                    <div className="flex items-center gap-2 flex-1">
                      <MapPin className="h-4 w-4 text-primary" />
                      <Label htmlFor="offline" className="cursor-pointer font-medium">
                        Offline (In-person)
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {formData.submissionMode === 'offline' && (
                <div className="space-y-4 p-4 rounded-lg glass-strong border border-primary/20 animate-fade-in">
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                    <p className="font-medium">
                      Meeting Location: <span className="text-foreground">Moon Bake, Kengeri Satellite Town, Bangalore 560060</span>
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Enter your city"
                      required={formData.submissionMode === 'offline'}
                      className="glass focus-glow transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium">Address *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Enter your full address"
                      rows={3}
                      required={formData.submissionMode === 'offline'}
                      className="glass focus-glow transition-all resize-none"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={createRequestMutation.isPending}
                  className="flex-1 gradient-primary hover:glow-primary transition-all hover:scale-105 text-white group"
                  size="lg"
                >
                  {createRequestMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      Submit Request
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
