
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-40">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">Z</span>
            </div>
            <span className="text-lg font-medium">Daily Zen Streak</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/') ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/habits" 
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/habits') ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Habits
          </Link>
          <Link 
            to="/progress" 
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/progress') ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Progress
          </Link>
          <Link 
            to="/profile" 
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/profile') ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Profile
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
