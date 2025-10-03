import { DashboardProps } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import OverviewAlumni from "./overview/overview-alumni";

export default function AlumniDashboard({ profile }: DashboardProps) {
  return (
    <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Alumni Dashboard</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Welcome back, {profile.full_name?.split(' ')[0] || 'Alumni'}!</p>
          </div>
          <Button asChild>
            <Link href="/posts/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Post
            </Link>
          </Button>
        </div>
      </header>
      <OverviewAlumni profile={profile} />

    </div>
  );
}