import { DashboardProps } from "@/types";
import OverviewStudent from "./overview/overview-Student";

export default function StudentDashboard({ profile }: DashboardProps) {
  return (
    <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-950">
      
      <OverviewStudent profile={profile} />
    </div>
  );
}
