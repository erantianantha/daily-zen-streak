
import React from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun, BellRing, BellOff, Trash2 } from "lucide-react";
import { useHabits } from "@/context/HabitContext";

const ProfilePage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { habits, deleteHabit } = useHabits();
  const [notifications, setNotifications] = React.useState(true);
  const [resetDialogOpen, setResetDialogOpen] = React.useState(false);
  const [userName, setUserName] = React.useState(() => {
    return localStorage.getItem("userName") || "";
  });

  const handleResetData = () => {
    if (window.confirm("Are you sure you want to reset all habit data? This action cannot be undone.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleSaveProfile = () => {
    localStorage.setItem("userName", userName);
    alert("Profile saved successfully!");
  };

  const handleToggleNotifications = () => {
    setNotifications(!notifications);
    
    if (!notifications) {
      // Request notification permission
      if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification("Notifications enabled", {
              body: "You will now receive notifications for habit reminders and completions.",
            });
          }
        });
      }
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-slide-up-fade">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Profile Settings</h1>
        </div>
        
        <div className="grid grid-cols-1 gap-6 max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input 
                  id="name" 
                  placeholder="Your name" 
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              
              <Button onClick={handleSaveProfile}>Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize your app experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {theme === "light" ? (
                    <Sun className="h-5 w-5 text-amber-500" />
                  ) : (
                    <Moon className="h-5 w-5 text-indigo-400" />
                  )}
                  <Label htmlFor="theme-mode">
                    {theme === "light" ? "Light Mode" : "Dark Mode"}
                  </Label>
                </div>
                <Switch
                  id="theme-mode"
                  checked={theme === "dark"}
                  onCheckedChange={toggleTheme}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configure reminder settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {notifications ? (
                    <BellRing className="h-5 w-5 text-green-500" />
                  ) : (
                    <BellOff className="h-5 w-5 text-muted-foreground" />
                  )}
                  <Label htmlFor="notifications">
                    {notifications ? "Notifications Enabled" : "Notifications Disabled"}
                  </Label>
                </div>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={handleToggleNotifications}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 dark:border-red-900">
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
              <CardDescription>Actions that cannot be undone</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="destructive" 
                className="gap-2"
                onClick={handleResetData}
              >
                <Trash2 className="h-4 w-4" />
                Reset All Data
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
