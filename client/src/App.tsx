import React from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ConferenceContext, ConferencesListContext, Conference } from "@/hooks/useConference";
import BottomNav from "@/components/BottomNav";
//import ConferenceSelector from "@/components/ConferenceSelector";
import SchedulePage from "@/pages/SchedulePage";
import MapPage from "@/pages/MapPage";
import VenuePage from "@/pages/VenuePage";
import PrizesPage from "@/pages/PrizesPage";
import ProfilePage from "@/pages/ProfilePage";
import AdminConference from "@/pages/AdminConference";
import LandingPage from "@/pages/LandingPage";
import NotFound from "@/pages/not-found";
import { Loader2 } from "lucide-react";
import { AuthContext } from "@/hooks/useAuth";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [location] = useLocation();
  const [currentConference, setCurrentConference] = useState<Conference | null>(() => {
    const saved = localStorage.getItem("currentConference");
    return saved ? JSON.parse(saved) : null;
  });
  const [conferencesList, setConferencesList] = useState<Conference[] | null>(() => {
    const saved = localStorage.getItem("conferencesList");
    return saved ? JSON.parse(saved) : null;
  });

  // Save currentConference to localStorage when it changes
  useEffect(() => {
    if (currentConference) {
      localStorage.setItem("currentConference", JSON.stringify(currentConference));
    } else {
      localStorage.removeItem("currentConference");
    }
  }, [currentConference]);

  // Save conferencesList to localStorage when it changes
  useEffect(() => {
    if (conferencesList) {
      localStorage.setItem("conferencesList", JSON.stringify(conferencesList));
    } else {
      localStorage.removeItem("conferencesList");
    }
  }, [conferencesList]);

  // Fetch conferences list from API using React Query
  const { data: conferencesData, error: conferencesError } = useQuery<Conference[]>({
    queryKey: ['/api/conferences'],
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  // Update conferencesList state when query data changes
  useEffect(() => {
    if (conferencesData && conferencesData.length > 0) {
      setConferencesList(conferencesData);
    }
  }, [conferencesData]);

  // Log errors for debugging (without overwriting existing data)
  useEffect(() => {
    if (conferencesError) {
      console.error("Failed to fetch conferences:", conferencesError);
    }
  }, [conferencesError]);

  // Apply runtime branding (CSS variables + favicon)
  useEffect(() => {
    if (!currentConference) return;

    const root = document.documentElement;
    if (currentConference.primaryColor) {
      root.style.setProperty("--conference-primary", currentConference.primaryColor);
    } else {
      root.style.removeProperty("--conference-primary");
    }
    if (currentConference.accentColor) {
      root.style.setProperty("--conference-accent", currentConference.accentColor);
    } else {
      root.style.removeProperty("--conference-accent");
    }

    if (currentConference.faviconUrl) {
      const link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (link) {
        link.href = currentConference.faviconUrl;
      } else {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = currentConference.faviconUrl;
        document.head.appendChild(newLink);
      }
    }
  }, [currentConference]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show landing/welcome page at root
  if (location === "/" || location === "/welcome") {
    return (
      <ConferenceContext.Provider value={{ currentConference, setCurrentConference }}>
        <ConferencesListContext.Provider value={{ conferencesList, setConferencesList }}>
          <AuthContext.Provider value={{ isAuthenticated, user, isLoading }}>
            <div className="h-screen flex flex-col bg-background">
              <div className="flex-1 overflow-hidden">
                <LandingPage />
              </div>
              <BottomNav />
            </div>
          </AuthContext.Provider>
        </ConferencesListContext.Provider>
      </ConferenceContext.Provider>
    );
  }

  return (
    <ConferenceContext.Provider value={{ currentConference, setCurrentConference, }}>
      <ConferencesListContext.Provider value={{ conferencesList, setConferencesList }}>
        <AuthContext.Provider value={{ isAuthenticated, user, isLoading }}>
          <div className="h-screen flex flex-col bg-background">
            <div className="flex-1 overflow-hidden">
              <Switch>
                <Route path="/schedule" component={SchedulePage} />
                <Route path="/map" component={MapPage} />
                <Route path="/venue" component={VenuePage} />
                <Route path="/prizes" component={PrizesPage} />
                <Route path="/profile" component={ProfilePage} />
                <Route path="/admin/conference" component={AdminConference} />
                <Route component={NotFound} />
              </Switch>
            </div>
            <BottomNav />
          </div>
        </AuthContext.Provider>
      </ConferencesListContext.Provider>
    </ConferenceContext.Provider>
  );
}

function App() {
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
