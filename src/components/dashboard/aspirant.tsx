import { DashboardProps } from "@/types";
import OverviewAspirant from "./overview/overview-aspirant";

export default function AspirantDashboard({ profile }: DashboardProps) {
  return (
    <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Aspirant Dashboard</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Welcome, {profile.full_name?.split(' ')[0] || 'Aspirant'}!</p>
        </div>
      </header>
      <OverviewAspirant profile={profile} />

    </div>
  );
}