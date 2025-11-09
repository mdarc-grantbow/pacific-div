import { Calendar, Map, Info, Award, User } from "lucide-react";
import { useLocation } from "wouter";

const navItems = [
  { path: "/", icon: Calendar, label: "Schedule" },
  { path: "/map", icon: Map, label: "Map" },
  { path: "/info", icon: Info, label: "Info" },
  { path: "/prizes", icon: Award, label: "Prizes" },
  { path: "/profile", icon: User, label: "Profile" },
];

export default function BottomNav() {
  const [location, setLocation] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-card-border z-50 safe-area-pb">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className="flex flex-col items-center justify-center flex-1 h-full gap-1 hover-elevate active-elevate-2"
              data-testid={`nav-${item.label.toLowerCase()}`}
            >
              <Icon 
                className={isActive ? "w-6 h-6 text-primary" : "w-6 h-6 text-muted-foreground"} 
                fill={isActive ? "currentColor" : "none"}
              />
              <span className={`text-xs ${isActive ? "text-primary font-medium" : "text-muted-foreground"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
