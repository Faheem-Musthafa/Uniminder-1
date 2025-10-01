import { DashboardProps } from "@/types";

export default function AspirantDashboard({ profile }: DashboardProps) {
  return <div>Aspirant Dashboard {profile.full_name}</div>;
}
