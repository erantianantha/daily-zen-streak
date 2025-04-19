
import React from "react";
import Layout from "@/components/layout/Layout";
import HabitList from "@/components/habits/HabitList";

const HabitsPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6 animate-slide-up-fade">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Habit Setup</h1>
        </div>
        
        <div className="space-y-8">
          <HabitList />
        </div>
      </div>
    </Layout>
  );
};

export default HabitsPage;
