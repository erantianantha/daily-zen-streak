
import React from "react";
import Layout from "@/components/layout/Layout";
import DashboardSummary from "@/components/dashboard/DashboardSummary";
import DailyQuote from "@/components/dashboard/DailyQuote";
import HabitCard from "@/components/habits/HabitCard";
import { useHabits } from "@/context/HabitContext";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { habits } = useHabits();
  const today = new Date().toISOString().split("T")[0];
  
  // Get habits that are sorted by if they're completed today or not (uncompleted first)
  const sortedHabits = [...habits].sort((a, b) => {
    const aCompleted = a.completedDates.includes(today);
    const bCompleted = b.completedDates.includes(today);
    if (aCompleted === bCompleted) return 0;
    return aCompleted ? 1 : -1;
  });
  
  // Show only up to 3 habits in the dashboard
  const displayHabits = sortedHabits.slice(0, 3);
  
  return (
    <Layout>
      <div className="space-y-8 animate-slide-up-fade">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold">Daily Zen Streak</h1>
          <div className="flex gap-2">
            <Link to="/habits">
              <Button size="sm" variant="outline" className="gap-1">
                <Plus className="h-4 w-4" />
                Add Habit
              </Button>
            </Link>
            <Link to="/progress">
              <Button size="sm" className="gap-1">
                <Calendar className="h-4 w-4" />
                View Progress
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <DashboardSummary />
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Today's Habits</h2>
                {habits.length > 3 && (
                  <Link to="/habits" className="text-sm text-primary hover:underline">
                    View all
                  </Link>
                )}
              </div>
              
              {habits.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-lg">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No habits added yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start tracking your habits to build consistency
                  </p>
                  <Link to="/habits">
                    <Button>
                      <Plus className="h-4 w-4 mr-1" /> Add Your First Habit
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {displayHabits.map((habit) => (
                    <HabitCard key={habit.id} habit={habit} />
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div>
            <DailyQuote />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
