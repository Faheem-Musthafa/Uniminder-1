import { DashboardProps } from "@/types";

export default function AlumniDashboard({ profile }: DashboardProps) {
  return <div>Alumni Dashboard {profile.full_name}</div>;
}
