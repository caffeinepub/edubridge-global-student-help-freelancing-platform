import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TypingHeroText from '../components/marketing/TypingHeroText';
import RevealOnScroll from '../components/animation/RevealOnScroll';
import FloatingShapes from '../components/animation/FloatingShapes';
import { GraduationCap, Briefcase, Building2, ArrowRight, Sparkles, Zap, Users } from 'lucide-react';
import { usePageTitle } from '../seo/usePageTitle';

export default function LandingPage() {
  usePageTitle('Home');
  const navigate = useNavigate();

  const features = [
    {
      icon: GraduationCap,
      title: 'Students Help',
      description: 'Get assistance with homework, projects, and coursework from experienced helpers.',
    },
    {
      icon: Briefcase,
      title: 'Freelancing Services',
      description: 'Connect with skilled freelancers for your project needs, both online and offline.',
    },
    {
      icon: Building2,
      title: 'Business Support',
      description: 'Find expert help for business ideas, planning, and execution.',
    },
  ];

  const stats = [
    { icon: Users, value: '10K+', label: 'Active Users' },
    { icon: Zap, value: '50K+', label: 'Tasks Completed' },
    { icon: Sparkles, value: '98%', label: 'Satisfaction Rate' },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <FloatingShapes />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 animate-gradient" />
        
        <div className="container relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Welcome to the Future of Learning</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                  Global Student Help &{' '}
                  <span className="text-gradient">
                    Freelancing Platform
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground">
                  Connect students, freelancers, and businesses for seamless collaboration and support.
                </p>
              </div>

              <TypingHeroText />

              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate({ to: '/create-account' })} 
                  className="group gradient-primary hover:glow-primary transition-all hover:scale-105 text-white"
                >
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate({ to: '/login' })}
                  className="glass hover:glass-strong hover-lift"
                >
                  Login
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => navigate({ to: '/student-request-help' })}
                  className="hover-lift"
                >
                  Request Help
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="text-center">
                      <div className="flex justify-center mb-2">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-2xl font-bold text-gradient">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
              <img
                src="/assets/generated/edubridge-hero-illustration.dim_1600x900.png"
                alt="Students and professionals collaborating"
                className="relative rounded-3xl shadow-2xl hover-lift"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="container relative">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 mb-4">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Our Services</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">How We Help</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                EduBridge connects you with the right people to achieve your goals
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <RevealOnScroll key={index}>
                  <Card className="h-full glass hover:glass-strong hover-lift group border-primary/10">
                    <CardHeader>
                      <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-4 group-hover:glow-primary transition-all">
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription className="text-base">{feature.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 animate-gradient" />
        <FloatingShapes />
        <div className="container relative">
          <RevealOnScroll>
            <Card className="max-w-3xl mx-auto text-center glass-strong border-primary/20 hover:glow-primary transition-all">
              <CardHeader className="space-y-4 pb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 mx-auto">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Join Today</span>
                </div>
                <CardTitle className="text-4xl md:text-5xl">Ready to Get Started?</CardTitle>
                <CardDescription className="text-lg">
                  Join thousands of students, helpers, and businesses on EduBridge
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button 
                    size="lg" 
                    onClick={() => navigate({ to: '/create-account' })}
                    className="gradient-primary hover:glow-primary transition-all hover:scale-105 text-white"
                  >
                    Sign Up Now
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={() => navigate({ to: '/login' })}
                    className="glass hover:glass-strong hover-lift"
                  >
                    Login
                  </Button>
                </div>
              </CardContent>
            </Card>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}
