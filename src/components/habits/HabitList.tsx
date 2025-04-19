
import React, { useState } from "react";
import { useHabits } from "@/context/HabitContext";
import HabitCard from "./HabitCard";
import { Button } from "@/components/ui/button";
import { Plus, Activity, ArrowUp, ArrowDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import HabitForm from "./HabitForm";

type SortOption = "name" | "streak" | "recent";
type FilterOption = "all" | "morning" | "afternoon" | "evening" | "anytime";

const HabitList: React.FC = () => {
  const { habits, getStreakCount } = useHabits();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("recent");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filterOption, setFilterOption] = useState<FilterOption>("all");

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const filteredHabits = habits.filter((habit) => {
    if (filterOption === "all") return true;
    return habit.timeOfDay === filterOption;
  });

  const sortedHabits = [...filteredHabits].sort((a, b) => {
    let comparison = 0;

    switch (sortOption) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "streak":
        comparison = getStreakCount(b.id) - getStreakCount(a.id);
        break;
      case "recent":
        comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        break;
      default:
        comparison = 0;
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold">My Habits</h2>
        
        <div className="flex flex-wrap gap-2">
          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant={filterOption === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilterOption("all")}
              className="rounded-none"
            >
              All
            </Button>
            <Button
              variant={filterOption === "morning" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilterOption("morning")}
              className="rounded-none"
            >
              Morning
            </Button>
            <Button
              variant={filterOption === "afternoon" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilterOption("afternoon")}
              className="rounded-none"
            >
              Afternoon
            </Button>
            <Button
              variant={filterOption === "evening" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilterOption("evening")}
              className="rounded-none"
            >
              Evening
            </Button>
          </div>
          
          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant={sortOption === "recent" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSortOption("recent")}
              className="rounded-none"
            >
              Recent
            </Button>
            <Button
              variant={sortOption === "name" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSortOption("name")}
              className="rounded-none"
            >
              Name
            </Button>
            <Button
              variant={sortOption === "streak" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSortOption("streak")}
              className="rounded-none"
            >
              Streak
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSortDirection}
              className="rounded-none"
            >
              {sortDirection === "asc" ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="ml-auto">
                <Plus className="h-4 w-4 mr-1" /> Add Habit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Habit</DialogTitle>
              </DialogHeader>
              <HabitForm onSuccess={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {habits.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No habits yet</h3>
          <p className="text-muted-foreground mb-4">
            Start tracking your daily habits to build consistency
          </p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-1" /> Add Your First Habit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Habit</DialogTitle>
              </DialogHeader>
              <HabitForm onSuccess={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedHabits.map((habit) => (
            <HabitCard 
              key={habit.id} 
              habit={habit} 
              onEdit={() => {
                // Edit functionality would be added here
              }} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HabitList;
