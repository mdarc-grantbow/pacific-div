import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import SchedulePage from "@/pages/SchedulePage";
import MapPage from "@/pages/MapPage";
import InfoPage from "@/pages/InfoPage";
import PrizesPage from "@/pages/PrizesPage";
import ProfilePage from "@/pages/ProfilePage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={SchedulePage} />
      <Route path="/map" component={MapPage} />
      <Route path="/info" component={InfoPage} />
      <Route path="/prizes" component={PrizesPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route component={NotFound} />
    </Switch>
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
        <div className="h-screen flex flex-col bg-background">
          <div className="flex-1 overflow-hidden">
            <Router />
          </div>
          <BottomNav />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
