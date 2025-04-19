
import React from "react";
import { format } from "date-fns";
import { useHabits } from "@/context/HabitContext";
import { Card, CardContent } from "@/components/ui/card";
import { CircularProgressIndicator } from "../ui/CircularProgressIndicator";

const DashboardSummary: React.FC = () => {
  const { habits, getCompletedForDate } = useHabits();
  const today = new Date().toISOString().split("T")[0];
  const completedTodayIds = getCompletedForDate(today);
  
  const totalHabits = habits.length;
  const completedToday = completedTodayIds.length;
  const completionRatio = totalHabits ? completedToday / totalHabits : 0;
  const completionPercentage = Math.round(completionRatio * 100);
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium text-lg">Today's Progress</h3>
            <p className="text-muted-foreground text-sm">{format(new Date(), "EEEE, MMMM d")}</p>
          </div>
          <CircularProgressIndicator
            value={completionPercentage}
            size={80}
            strokeWidth={8}
            label={`${completionPercentage}%`}
            labelClassName="text-sm font-medium"
          />
        </div>
        
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="bg-accent/50 rounded-lg p-3">
            <p className="text-xl font-bold">{totalHabits}</p>
            <p className="text-xs text-muted-foreground">Total Habits</p>
          </div>
          <div className="bg-accent/50 rounded-lg p-3">
            <p className="text-xl font-bold">{completedToday}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          <div className="bg-accent/50 rounded-lg p-3">
            <p className="text-xl font-bold">{totalHabits - completedToday}</p>
            <p className="text-xs text-muted-foreground">Remaining</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardSummary;
