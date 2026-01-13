import { User, Bell, Moon, Sun, Info, MessageSquare, CheckCircle2, ExternalLink, LogOut, LogIn, Radio } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuthContext } from "@/hooks/useAuth";
import { useConference } from "@/hooks/useConference";
import type { UserProfile } from "@shared/schema";

type SurveyCategory = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
};

export default function ProfilePage() {
  const { toast } = useToast();
  const { isAuthenticated } = useAuthContext();
  const { currentConference } = useConference();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const conferenceName = currentConference?.name ?? 'Pacificon';
  const conferenceYear = currentConference?.year ?? 2025;
  const conferenceDivision = currentConference?.division ?? 'Pacific';
  const conferenceLocation = currentConference?.location ?? 'San Ramon Marriott, CA';
  
  const formatConferenceDates = () => {
    if (currentConference?.startDate && currentConference?.endDate) {
      const start = new Date(currentConference.startDate);
      const end = new Date(currentConference.endDate);
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
      const startMonth = months[start.getUTCMonth()];
      const startDay = start.getUTCDate();
      const endMonth = months[end.getUTCMonth()];
      const endDay = end.getUTCDate();
      const endYear = end.getUTCFullYear();
      
      if (startMonth === endMonth) {
        return `${startMonth} ${startDay}-${endDay}, ${endYear}`;
      } else {
        return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${endYear}`;
      }
    }
    return 'October 10-12, 2025';
  };

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const { data: userProfile } = useQuery<UserProfile>({
    queryKey: ['/api/profile'],
    enabled: isAuthenticated,
  });

  const userData = userProfile || {
    callSign: "Loading...",
    name: "Loading...",
    badgeNumber: "---",
    licenseClass: "---",
  };

  const isRegistered = userProfile?.isRegistered ?? false;

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col h-full">
        <header className="sticky top-0 z-40 bg-background border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/welcome" className="hover:opacity-80 transition-opacity flex items-center gap-2" data-testid="link-welcome">
              <Radio className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-medium text-foreground">Profile</h1>
            </Link>
            <Button size="sm" variant="ghost" onClick={() => conferenceName)}>Change Conference</Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-4 pb-20">
          <Card className="p-6 text-center">
            <LogIn className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-lg font-medium text-foreground mb-2">Sign in to access your profile</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Log in to save your bookmarks, track your badge number, and complete feedback surveys.
            </p>
            <Button asChild data-testid="button-login-profile">
              <a href="/api/login">Log In</a>
            </Button>
          </Card>

          <Card className="p-4 mt-4">
            <h3 className="font-medium text-foreground mb-4">Settings</h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {darkMode ? (
                  <Moon className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Sun className="w-5 h-5 text-muted-foreground" />
                )}
                <Label htmlFor="dark-mode-guest" className="text-sm font-normal cursor-pointer">
                  Dark Mode
                </Label>
              </div>
              <Switch 
                id="dark-mode-guest" 
                checked={darkMode} 
                onCheckedChange={toggleDarkMode}
                data-testid="switch-dark-mode"
              />
            </div>
          </Card>

          <Card className="p-4 mt-4">
            <h3 className="font-medium text-foreground mb-3">About {conferenceName}</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {conferenceName} is the premier amateur radio event in the ARRL {conferenceDivision} Division's annual convention.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Info className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{formatConferenceDates()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Info className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{conferenceLocation}</span>
              </div>
            </div>
            <Separator className="my-3" />
            <a 
              href="https://www.pacificon.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
              data-testid="link-website"
            >
              Visit pacificon.org
            </a>
          </Card>
        </main>
      </div>
    );
  }

  const surveyCategories: SurveyCategory[] = [
    {
      id: "attendee",
      title: "Attendee Feedback",
      description: "Share your experience as a conference attendee",
      completed: false,
    },
    {
      id: "exhibitor",
      title: "Exhibitor Feedback",
      description: "Provide feedback on the vendor and exhibit experience",
      completed: false,
    },
    {
      id: "speaker",
      title: "Speaker Feedback",
      description: "Share your experience as a presenter or forum speaker",
      completed: false,
    },
    {
      id: "volunteer",
      title: "Volunteer Feedback",
      description: "Tell us about your volunteer experience",
      completed: false,
    },
    {
      id: "staff",
      title: "Staff Feedback",
      description: "Provide feedback as a conference staff member",
      completed: false,
    },
  ];

  const { data: surveyResponses = [] } = useQuery<{surveyType: string}[]>({
    queryKey: ['/api/surveys'],
  });

  const completedSurveys = new Set(surveyResponses.map(r => r.surveyType));
  
  const surveys = surveyCategories.map(cat => ({
    ...cat,
    completed: completedSurveys.has(cat.id),
  }));

  const markSurveyCompleteMutation = useMutation({
    mutationFn: (surveyId: string) => 
      apiRequest('POST', `/api/surveys/${surveyId}`, { responses: {} }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/surveys'] });
      toast({
        title: "Survey marked complete",
        description: "Your feedback has been recorded. Thank you!",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mark survey as complete. Please try again.",
      });
    },
  });

  const handleSurveyClick = (surveyId: string) => {
    const surveyUrls: Record<string, string> = {
      attendee: 'https://www.pacificon.org/feedback/attendees',
      exhibitor: 'https://www.pacificon.org/feedback/exhibitors',
      speaker: 'https://www.pacificon.org/feedback/speakers',
      volunteer: 'https://www.pacificon.org/feedback/volunteers',
      staff: 'https://www.pacificon.org/feedback/staff',
    };
    
    const url = surveyUrls[surveyId];
    if (url) {
      window.open(url, '_blank');
      markSurveyCompleteMutation.mutate(surveyId);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 z-40 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/welcome" className="hover:opacity-80 transition-opacity flex items-center gap-2" data-testid="link-welcome">
            <Radio className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-medium text-foreground">Profile</h1>
          </Link>
          <div className="flex items-center gap-2">
            <Button size="sm" asChild variant="ghost">
              <Link href="/admin/conference">Admin</Link>
            </Button>
            <Button size="sm" variant="ghost" onClick={() => conferenceName}>Change Conference</Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 pb-20">
        {!isRegistered && (
          <Card className="p-4 mb-4 bg-primary/10 border-primary">
            <h3 className="font-medium text-foreground mb-2">Register for Pacificon</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Complete your registration to access all conference features
            </p>
            
            <div className="space-y-2">
              <a
                href="https://www.pacificon.org/registration/attendees"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 rounded-md bg-card hover-elevate"
                data-testid="link-attendee-registration"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">Attendees & Exhibitors</p>
                  <p className="text-xs text-muted-foreground">Via Constant Contact</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </a>
              
              <a
                href="https://www.pacificon.org/registration/volunteers"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 rounded-md bg-card hover-elevate"
                data-testid="link-volunteer-registration"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">Volunteers & Speakers</p>
                  <p className="text-xs text-muted-foreground">Via Google Forms</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </a>
            </div>
          </Card>
        )}
        
        <Card className="p-6 mb-4">
          {!userProfile ? (
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-muted animate-pulse rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-6 bg-muted animate-pulse rounded w-32" />
                <div className="h-4 bg-muted animate-pulse rounded w-48" />
                <div className="h-3 bg-muted animate-pulse rounded w-40" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl font-medium">
                  {userData.callSign.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h2 className="text-lg font-medium text-foreground" data-testid="text-callsign">
                  {userData.callSign}
                </h2>
                <p className="text-sm text-muted-foreground" data-testid="text-name">
                  {userData.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    Badge #{userData.badgeNumber}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    {userData.licenseClass} Class
                  </span>
                </div>
              </div>
            </div>
          )}
        </Card>

        <Card className="p-4 mb-4">
          <h3 className="font-medium text-foreground mb-4">Settings</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {darkMode ? (
                  <Moon className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Sun className="w-5 h-5 text-muted-foreground" />
                )}
                <Label htmlFor="dark-mode" className="text-sm font-normal cursor-pointer">
                  Dark Mode
                </Label>
              </div>
              <Switch 
                id="dark-mode" 
                checked={darkMode} 
                onCheckedChange={toggleDarkMode}
                data-testid="switch-dark-mode"
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <Label htmlFor="notifications" className="text-sm font-normal cursor-pointer">
                  Prize Notifications
                </Label>
              </div>
              <Switch 
                id="notifications" 
                checked={notifications} 
                onCheckedChange={setNotifications}
                data-testid="switch-notifications"
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm">Sign Out</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = '/api/logout'}
                data-testid="button-logout"
              >
                Logout
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-medium text-foreground">Provide Feedback</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Help us improve! Share your feedback in any areas that apply to you.
          </p>
          
          <div className="space-y-2">
            {surveys.map((survey) => (
              <Card
                key={survey.id}
                className="p-3 hover-elevate cursor-pointer"
                onClick={() => handleSurveyClick(survey.id)}
                data-testid={`survey-${survey.id}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium text-foreground">
                        {survey.title}
                      </h4>
                      {survey.completed && (
                        <Badge variant="secondary" className="text-xs gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Done
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {survey.description}
                    </p>
                  </div>
                  <span className="text-muted-foreground">›</span>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-medium text-foreground mb-3">About {conferenceName}</h3>
          <p className="text-sm text-muted-foreground mb-3">
            {conferenceName} is the premier amateur radio event in the ARRL {conferenceDivision} Division's annual convention.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Info className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{formatConferenceDates()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Info className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{conferenceLocation}</span>
            </div>
          </div>
          <Separator className="my-3" />
          <a 
            href="https://www.pacificon.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
            data-testid="link-website"
          >
            Visit pacificon.org →
          </a>
        </Card>
      </main>
    </div>
  );
}
