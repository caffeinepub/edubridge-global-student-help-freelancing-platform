import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '../hooks/useAuth';
import { useSaveCallerUserProfile } from '../hooks/useCurrentUserProfile';
import { UserRole } from '../backend';
import { storeProfileExtras } from '../utils/localProfileExtras';
import { usePageTitle } from '../seo/usePageTitle';
import { toast } from 'sonner';
import { UserPlus, Sparkles } from 'lucide-react';
import FloatingShapes from '../components/animation/FloatingShapes';
import { getSessionParameter } from '../utils/urlParams';

export default function CreateAccountPage() {
  usePageTitle('Create Account');
  const navigate = useNavigate();
  const { login, isAuthenticated, identity, userProfile, navigateToDashboard } = useAuth();
  const saveProfileMutation = useSaveCallerUserProfile();

  const [step, setStep] = useState<'login' | 'profile'>('login');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    country: '',
    role: 'student' as 'student' | 'helper' | 'business' | 'client',
  });

  useEffect(() => {
    // Check for pre-selected role from landing page
    const selectedRole = getSessionParameter('selectedRole');
    if (selectedRole && (selectedRole === 'student' || selectedRole === 'client' || selectedRole === 'business')) {
      setFormData(prev => ({ ...prev, role: selectedRole as any }));
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && !userProfile) {
      setStep('profile');
    } else if (isAuthenticated && userProfile) {
      navigateToDashboard(userProfile.role);
    }
  }, [isAuthenticated, userProfile]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.age || !formData.email || !formData.country) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const roleMap: Record<string, UserRole> = {
        student: UserRole.student,
        helper: UserRole.helper,
        business: UserRole.business,
        client: UserRole.client,
      };

      await saveProfileMutation.mutateAsync({
        name: formData.name,
        role: roleMap[formData.role],
        biography: undefined,
        organization: undefined,
        skills: undefined,
      });

      if (identity) {
        storeProfileExtras(identity.getPrincipal().toString(), {
          age: parseInt(formData.age),
          email: formData.email,
          country: formData.country,
        });
      }

      toast.success('Account created successfully!', {
        description: 'Welcome to EduBridge!',
      });
      navigateToDashboard(roleMap[formData.role]);
    } catch (error) {
      toast.error('Failed to create account');
    }
  };

  if (step === 'login') {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative overflow-hidden">
        <FloatingShapes />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 animate-gradient" />
        
        <Card className="w-full max-w-md glass-strong border-primary/20 hover:glow-primary transition-all animate-scale-in relative z-10">
          <CardHeader className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 mx-auto">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Get Started</span>
            </div>
            <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
            <CardDescription className="text-base">Get started with EduBridge</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleLogin} 
              className="w-full gradient-primary hover:glow-primary transition-all hover:scale-105 text-white group" 
              size="lg"
            >
              <UserPlus className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              Continue with Internet Identity
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative overflow-hidden">
      <FloatingShapes />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 animate-gradient" />
      
      <Card className="w-full max-w-md glass-strong border-primary/20 hover:glow-primary transition-all animate-scale-in relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 mx-auto">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Almost There</span>
          </div>
          <CardTitle className="text-3xl font-bold">Complete Your Profile</CardTitle>
          <CardDescription className="text-base">Tell us about yourself</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                required
                className="glass focus-glow transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="glass focus-glow transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country" className="text-sm font-medium">Country *</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                required
                className="glass focus-glow transition-all"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Role *</Label>
              <RadioGroup
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as any })}
                className="space-y-2"
              >
                <div className="flex items-center space-x-3 p-3 rounded-lg glass hover:glass-strong transition-all cursor-pointer">
                  <RadioGroupItem value="student" id="student" />
                  <Label htmlFor="student" className="cursor-pointer flex-1">
                    Student
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg glass hover:glass-strong transition-all cursor-pointer">
                  <RadioGroupItem value="client" id="client" />
                  <Label htmlFor="client" className="cursor-pointer flex-1">
                    Client
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg glass hover:glass-strong transition-all cursor-pointer">
                  <RadioGroupItem value="business" id="business" />
                  <Label htmlFor="business" className="cursor-pointer flex-1">
                    Business
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg glass hover:glass-strong transition-all cursor-pointer">
                  <RadioGroupItem value="helper" id="helper" />
                  <Label htmlFor="helper" className="cursor-pointer flex-1">
                    Freelancer
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button 
              type="submit" 
              className="w-full gradient-primary hover:glow-primary transition-all hover:scale-105 text-white" 
              disabled={saveProfileMutation.isPending}
              size="lg"
            >
              {saveProfileMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
