import { Profile } from "@/types";

interface OverviewStudentProps {
  profile: Profile;
}

export default async function OverviewStudent({}: OverviewStudentProps) {
  // TODO: Implement student overview dashboard with the following stats:
  // - Bookmarks count
  // - Applications count  
  // - Unread messages count
  // - Connections count

  return (
    <h1 className="px-6 py-6 text-3xl font-bold ">Welcome to Student Overview</h1>
  );
}
