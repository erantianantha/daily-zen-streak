
import React from "react";
import { format } from "date-fns";
import { Check, Activity, Edit, Clock, Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Habit, useHabits } from "@/context/HabitContext";
import { cn } from "@/lib/utils";

interface HabitCardProps {
  habit: Habit;
  onEdit?: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onEdit }) => {
  const { completeHabit, uncompleteHabit, getStreakCount } = useHabits();
  const today = new Date().toISOString().split("T")[0];
  const isCompletedToday = habit.completedDates.includes(today);
  const streak = getStreakCount(habit.id);

  const getTimeIcon = () => {
    switch (habit.timeOfDay) {
      case "morning":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "afternoon":
        return <Clock className="h-4 w-4 text-orange-500" />;
      case "evening":
        return <Clock className="h-4 w-4 text-indigo-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getHabitIcon = () => {
    // Use a default icon of Activity
    return <Activity className={`h-5 w-5 text-${habit.color}`} />;
  };

  const toggleComplete = () => {
    if (isCompletedToday) {
      uncompleteHabit(habit.id, today);
    } else {
      completeHabit(habit.id, today);
      // Show notification
      if (Notification.permission === "granted") {
        new Notification("Habit Completed!", {
          body: `Great job completing "${habit.name}" today!`,
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification("Habit Completed!", {
              body: `Great job completing "${habit.name}" today!`,
            });
          }
        });
      }
    }
  };

  return (
    <Card className={cn(
      "glass-card overflow-hidden transition-all duration-300 hover:shadow-md",
      isCompletedToday && "border-primary/50 bg-primary/5"
    )}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full bg-${habit.color}/20`}>
              {getHabitIcon()}
            </div>
            <div>
              <h3 className="font-medium text-lg">{habit.name}</h3>
              <p className="text-muted-foreground text-sm">{habit.description}</p>
            </div>
          </div>
          {onEdit && (
            <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8">
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            {getTimeIcon()}
            <span className="capitalize">{habit.timeOfDay || "Anytime"}</span>
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Star className="h-4 w-4 text-amber-500" />
            <span>{streak} day streak</span>
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="text-xs text-muted-foreground">
          Started {format(new Date(habit.createdAt), "MMM d, yyyy")}
        </div>
        <Button
          variant={isCompletedToday ? "outline" : "default"}
          size="sm"
          className={cn(
            "transition-all",
            isCompletedToday && "border-green-500 text-green-500"
          )}
          onClick={toggleComplete}
        >
          {isCompletedToday ? (
            <span className="flex items-center gap-1">
              <Check className="h-4 w-4" />
              Completed
            </span>
          ) : (
            "Complete"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HabitCard;
