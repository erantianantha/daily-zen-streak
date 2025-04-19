
import React from "react";
import Layout from "@/components/layout/Layout";
import HabitCalendar from "@/components/calendar/HabitCalendar";
import { useHabits } from "@/context/HabitContext";
import { Card, CardContent } from "@/components/ui/card";
import { CircularProgressIndicator } from "@/components/ui/CircularProgressIndicator";
import { Activity, Award, Star } from "lucide-react";

const ProgressPage: React.FC = () => {
  const { habits, getStreakCount } = useHabits();
  
  // Calculate the longest streak across all habits
  const getLongestStreak = () => {
    if (habits.length === 0) return 0;
    
    return Math.max(...habits.map(habit => getStreakCount(habit.id)));
  };
  
  // Calculate the total number of completed habit instances
  const getTotalCompletions = () => {
    return habits.reduce((total, habit) => total + habit.completedDates.length, 0);
  };
  
  // Calculate completion rate (total completions / potential completions)
  const getCompletionRate = () => {
    if (habits.length === 0) return 0;
    
    const today = new Date();
    const totalPossibleCompletions = habits.reduce((total, habit) => {
      const habitStart = new Date(habit.createdAt);
      const daysSinceStart = Math.floor((today.getTime() - habitStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return total + daysSinceStart;
    }, 0);
    
    const totalCompletions = getTotalCompletions();
    return totalPossibleCompletions > 0 
      ? Math.round((totalCompletions / totalPossibleCompletions) * 100) 
      : 0;
  };
  
  return (
    <Layout>
      <div className="space-y-6 animate-slide-up-fade">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Your Progress</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3">
                <Award className="h-8 w-8 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Longest Streak</p>
                <p className="text-2xl font-bold">{getLongestStreak()} days</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-3">
                <Star className="h-8 w-8 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Completions</p>
                <p className="text-2xl font-bold">{getTotalCompletions()}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="rounded-full bg-indigo-100 dark:bg-indigo-900/30 p-3">
                <Activity className="h-8 w-8 text-indigo-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{getCompletionRate()}%</p>
                  <CircularProgressIndicator 
                    value={getCompletionRate()}
                    size={36}
                    strokeWidth={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <HabitCalendar />
      </div>
    </Layout>
  );
};

export default ProgressPage;
