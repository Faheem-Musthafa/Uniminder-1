import { DashboardProps } from "@/types";

export default function StudentDashboard({ profile }: DashboardProps) {
  return <div>Student Dashboard {profile.full_name}</div>;
}
