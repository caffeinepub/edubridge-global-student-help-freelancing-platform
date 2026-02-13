import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TypingHeroText from '../components/marketing/TypingHeroText';
import RevealOnScroll from '../components/animation/RevealOnScroll';
import FloatingShapes from '../components/animation/FloatingShapes';
import { GraduationCap, Briefcase, Building2, ArrowRight, Sparkles, Zap, Users, UserCircle } from 'lucide-react';
import { usePageTitle } from '../seo/usePageTitle';
import { storeSessionParameter } from '../utils/urlParams';

export default function LandingPage() {
  usePageTitle('Home');
  const navigate = useNavigate();

  const handleRoleSelection = (role: 'student' | 'client' | 'business') => {
    storeSessionParameter('selectedRole', role);
    navigate({ to: '/create-account' });
  };

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
                  className="glass hover:glass-strong transition-all hover:scale-105"
                >
                  Login
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate({ to: '/work-request' })}
                  className="glass hover:glass-strong transition-all hover:scale-105"
                >
                  Request Help
                </Button>
              </div>
            </div>

            <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="relative z-10">
                <img 
                  src="/assets/generated/edubridge-hero-illustration.dim_1600x900.png" 
                  alt="EduBridge Platform" 
                  className="w-full h-auto rounded-2xl shadow-2xl glass-strong p-4"
                />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl -z-10 animate-pulse-slow" />
            </div>
          </div>
        </div>
      </section>

      {/* Entry Selection Section */}
      <section className="py-20 relative overflow-hidden">
        <FloatingShapes />
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-accent/5 to-primary/5 animate-gradient" />
        
        <div className="container relative z-10">
          <RevealOnScroll>
            <div className="text-center space-y-4 mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Choose Your Path</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">
                Who Are <span className="text-gradient">You?</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Select your role to get started with EduBridge
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <RevealOnScroll delay={0.1}>
              <Card 
                className="glass hover:glass-strong hover-lift cursor-pointer transition-all group border-primary/20 hover:border-primary/40"
                onClick={() => handleRoleSelection('student')}
              >
                <CardHeader className="text-center space-y-4">
                  <div className="mx-auto w-20 h-20 rounded-full gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <GraduationCap className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold group-hover:text-gradient transition-all">
                    Student
                  </CardTitle>
                  <CardDescription className="text-base">
                    Get help with assignments, homework, and projects
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button 
                    className="w-full gradient-primary hover:glow-primary text-white group-hover:scale-105 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRoleSelection('student');
                    }}
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </RevealOnScroll>

            <RevealOnScroll delay={0.2}>
              <Card 
                className="glass hover:glass-strong hover-lift cursor-pointer transition-all group border-secondary/20 hover:border-secondary/40"
                onClick={() => handleRoleSelection('client')}
              >
                <CardHeader className="text-center space-y-4">
                  <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UserCircle className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold group-hover:text-gradient transition-all">
                    Client
                  </CardTitle>
                  <CardDescription className="text-base">
                    Request freelancing services for your projects
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button 
                    className="w-full bg-gradient-to-r from-secondary to-accent hover:glow-secondary text-white group-hover:scale-105 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRoleSelection('client');
                    }}
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </RevealOnScroll>

            <RevealOnScroll delay={0.3}>
              <Card 
                className="glass hover:glass-strong hover-lift cursor-pointer transition-all group border-accent/20 hover:border-accent/40"
                onClick={() => handleRoleSelection('business')}
              >
                <CardHeader className="text-center space-y-4">
                  <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Building2 className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold group-hover:text-gradient transition-all">
                    Business
                  </CardTitle>
                  <CardDescription className="text-base">
                    Find expert help for business planning and execution
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button 
                    className="w-full bg-gradient-to-r from-accent to-primary hover:glow-accent text-white group-hover:scale-105 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRoleSelection('business');
                    }}
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
        
        <div className="container relative z-10">
          <RevealOnScroll>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <Card key={index} className="glass hover:glass-strong hover-lift transition-all text-center">
                  <CardContent className="pt-8 pb-8">
                    <stat.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <div className="text-4xl font-bold text-gradient mb-2">{stat.value}</div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative overflow-hidden">
        <FloatingShapes />
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-accent/5 to-primary/5 animate-gradient" />
        
        <div className="container relative z-10">
          <RevealOnScroll>
            <div className="text-center space-y-4 mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Our Services</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">
                What We <span className="text-gradient">Offer</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comprehensive support for students, freelancers, and businesses
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <RevealOnScroll key={index} delay={index * 0.1}>
                <Card className="glass hover:glass-strong hover-lift transition-all h-full">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-4">
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <FloatingShapes />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 animate-gradient" />
        
        <div className="container relative z-10">
          <RevealOnScroll>
            <Card className="glass-strong border-primary/20 hover:glow-primary transition-all">
              <CardContent className="py-16 text-center space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold">
                  Ready to Get <span className="text-gradient">Started?</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Join thousands of students, freelancers, and businesses already using EduBridge
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
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
                    onClick={() => navigate({ to: '/work-request' })}
                    className="glass hover:glass-strong transition-all hover:scale-105"
                  >
                    Request Help Now
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
