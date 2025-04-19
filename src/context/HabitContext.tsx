
import React, { createContext, useContext, useState, useEffect } from "react";

// Define types
export interface Habit {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  frequency: "daily" | "weekly";
  timeOfDay?: "morning" | "afternoon" | "evening" | "anytime";
  createdAt: string;
  completedDates: string[]; // ISO date strings
}

export interface HabitContextType {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, "id" | "createdAt" | "completedDates">) => void;
  updateHabit: (id: string, habit: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  completeHabit: (id: string, date: string) => void;
  uncompleteHabit: (id: string, date: string) => void;
  getStreakCount: (id: string) => number;
  getCompletedForDate: (date: string) => string[];
}

// Create context
const HabitContext = createContext<HabitContextType | undefined>(undefined);

// Sample habits for initial state
const initialHabits: Habit[] = [
  {
    id: "1",
    name: "Meditation",
    description: "10 minutes of mindfulness meditation",
    icon: "activity",
    color: "zen-purple",
    frequency: "daily",
    timeOfDay: "morning",
    createdAt: new Date().toISOString(),
    completedDates: [
      new Date().toISOString().split("T")[0],
      new Date(Date.now() - 86400000).toISOString().split("T")[0], // Yesterday
      new Date(Date.now() - 86400000 * 2).toISOString().split("T")[0], // Day before yesterday
    ],
  },
  {
    id: "2",
    name: "Journaling",
    description: "Write about your thoughts and feelings",
    icon: "edit",
    color: "zen-blue",
    frequency: "daily",
    timeOfDay: "evening",
    createdAt: new Date().toISOString(),
    completedDates: [
      new Date(Date.now() - 86400000).toISOString().split("T")[0], // Yesterday
    ],
  },
  {
    id: "3",
    name: "Drink Water",
    description: "8 glasses of water throughout the day",
    icon: "drop",
    color: "zen-indigo",
    frequency: "daily",
    timeOfDay: "anytime",
    createdAt: new Date().toISOString(),
    completedDates: [
      new Date().toISOString().split("T")[0],
      new Date(Date.now() - 86400000).toISOString().split("T")[0], // Yesterday
      new Date(Date.now() - 86400000 * 2).toISOString().split("T")[0], // Day before yesterday
      new Date(Date.now() - 86400000 * 3).toISOString().split("T")[0], // 3 days ago
      new Date(Date.now() - 86400000 * 4).toISOString().split("T")[0], // 4 days ago
    ],
  },
];

// Provider component
export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    // Load from localStorage if available
    const savedHabits = localStorage.getItem("habits");
    return savedHabits ? JSON.parse(savedHabits) : initialHabits;
  });

  // Save to localStorage whenever habits change
  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  const addHabit = (habit: Omit<Habit, "id" | "createdAt" | "completedDates">) => {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      completedDates: [],
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits((prev) =>
      prev.map((habit) => (habit.id === id ? { ...habit, ...updates } : habit))
    );
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== id));
  };

  const completeHabit = (id: string, date: string) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id === id && !habit.completedDates.includes(date)) {
          return {
            ...habit,
            completedDates: [...habit.completedDates, date],
          };
        }
        return habit;
      })
    );
  };

  const uncompleteHabit = (id: string, date: string) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id === id) {
          return {
            ...habit,
            completedDates: habit.completedDates.filter((d) => d !== date),
          };
        }
        return habit;
      })
    );
  };

  // Calculate the current streak for a habit
  const getStreakCount = (id: string): number => {
    const habit = habits.find((h) => h.id === id);
    if (!habit) return 0;

    const sortedDates = [...habit.completedDates].sort();
    if (sortedDates.length === 0) return 0;

    // Check if today or yesterday is in the completed dates
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    
    const hasToday = sortedDates.includes(today);
    const hasYesterday = sortedDates.includes(yesterday);
    
    if (!hasToday && !hasYesterday) return 0;

    let streak = 1; // Start with either today or yesterday
    let currentDate = hasToday ? today : yesterday;
    let currentDateObj = new Date(currentDate);

    // Go backwards from the current date
    while (true) {
      currentDateObj.setDate(currentDateObj.getDate() - 1);
      const prevDate = currentDateObj.toISOString().split("T")[0];
      
      // If the previous date is completed, increment streak
      if (sortedDates.includes(prevDate)) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  // Get all habits completed for a specific date
  const getCompletedForDate = (date: string): string[] => {
    return habits
      .filter((habit) => habit.completedDates.includes(date))
      .map((habit) => habit.id);
  };

  const value = {
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    completeHabit,
    uncompleteHabit,
    getStreakCount,
    getCompletedForDate,
  };

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
};

// Custom hook for using the context
export const useHabits = (): HabitContextType => {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error("useHabits must be used within a HabitProvider");
  }
  return context;
};
