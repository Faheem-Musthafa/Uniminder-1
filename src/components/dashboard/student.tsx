"use client";

import { DashboardProps } from "@/types";
import OverviewStudent from "./overview/overview-Student";
import PostsFeed from "./posts-feed";
import { useDashboardView } from "@/hooks/use-dashboard-view";

export default function StudentDashboard({ profile }: DashboardProps) {
  const { currentView, setCurrentView } = useDashboardView();

  return (
    <div className="w-full">
      {currentView === "overview" && <OverviewStudent profile={profile} />}
      {currentView === "posts" && <PostsFeed profile={profile} onBack={() => setCurrentView("overview")} />}
    </div>
  );
}
