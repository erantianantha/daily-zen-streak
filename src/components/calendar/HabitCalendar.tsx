
import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, isWeekend, parseISO, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useHabits } from "@/context/HabitContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HabitCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { habits, getCompletedForDate } = useHabits();
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };
  
  const getDayClass = (day: Date) => {
    const dateString = format(day, "yyyy-MM-dd");
    const completedHabits = getCompletedForDate(dateString);
    const totalHabits = habits.length;
    const completionRatio = totalHabits ? completedHabits.length / totalHabits : 0;
    
    let bgColorClass = "";
    
    if (completionRatio === 1) {
      bgColorClass = "bg-primary";
    } else if (completionRatio >= 0.7) {
      bgColorClass = "bg-primary/70";
    } else if (completionRatio >= 0.4) {
      bgColorClass = "bg-primary/50";
    } else if (completionRatio > 0) {
      bgColorClass = "bg-primary/30";
    }
    
    return cn(
      "calendar-day",
      isToday(day) && "ring-2 ring-primary",
      !isSameMonth(day, currentMonth) && "text-muted-foreground opacity-50",
      isWeekend(day) && !isToday(day) && "text-muted-foreground",
      completedHabits.length > 0 && bgColorClass
    );
  };
  
  // Generate streaks data for visualization
  const getStreakData = () => {
    if (!habits.length) return [];
    
    // For simplicity, we'll show streaks for up to 30 days
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 29);
    
    const days = eachDayOfInterval({ start: thirtyDaysAgo, end: today });
    
    return days.map(day => {
      const dateStr = format(day, "yyyy-MM-dd");
      const completedHabits = getCompletedForDate(dateStr);
      const totalHabits = habits.length;
      
      return {
        date: dateStr,
        day: format(day, "d"),
        isToday: isToday(day),
        completedCount: completedHabits.length,
        totalCount: totalHabits,
        completionRatio: totalHabits ? completedHabits.length / totalHabits : 0
      };
    });
  };
  
  const streakData = getStreakData();
  const currentStreak = streakData
    .reverse()
    .findIndex(day => day.completionRatio < 0.5);
  
  const streakCount = currentStreak === -1 
    ? streakData.length 
    : currentStreak;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold">Your Progress</h2>
        
        {/* Streaks visualization */}
        <div className="bg-accent/50 rounded-lg p-4">
          <div className="mb-2 flex justify-between items-center">
            <h3 className="font-medium">Current Streak</h3>
            <span className="text-lg font-bold">{streakCount} days</span>
          </div>
          <div className="flex items-center space-x-1 overflow-x-auto pb-2">
            {getStreakData().map((day, index) => (
              <div 
                key={index}
                className="flex flex-col items-center min-w-9"
              >
                <div 
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                    day.isToday && "ring-2 ring-primary",
                    day.completionRatio === 1 && "bg-primary text-primary-foreground",
                    day.completionRatio >= 0.5 && day.completionRatio < 1 && "bg-primary/70 text-primary-foreground",
                    day.completionRatio > 0 && day.completionRatio < 0.5 && "bg-primary/30 text-foreground",
                    day.completionRatio === 0 && "bg-muted text-muted-foreground"
                  )}
                >
                  {day.day}
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  {day.completedCount}/{day.totalCount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Calendar */}
      <div className="bg-background rounded-lg border shadow-sm">
        <div className="p-4 flex items-center justify-between">
          <h3 className="font-medium">{format(currentMonth, "MMMM yyyy")}</h3>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={previousMonth}
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextMonth}
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1 p-4">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div 
              key={day} 
              className="text-center text-sm font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
          
          {daysInMonth.map((day, i) => (
            <div
              key={i}
              className="text-center py-1"
            >
              <div className={getDayClass(day)}>
                <span className="text-sm">{format(day, "d")}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HabitCalendar;
