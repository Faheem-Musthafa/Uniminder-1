"use client"

import * as React from "react"
import {
  Calendar,
  GraduationCap,
  Home,
  MessageSquare,
  Users,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Profile } from "@/types"

// Create student sidebar data based on profile
const createStudentData = (profile: Profile) => ({
  user: {
    name: profile.full_name || "Student",
    email: profile.email || "student@university.edu",
    avatar: "/avatars/student.jpg",
  },
  roles: [
    {
      name: "Student",
      logo: GraduationCap,
      plan: profile.college || "Active",
    },
  ],
  navMain: [
    {
      title: "Overview",
      url: "/dashboard/student",
      icon: Home,
      isActive: true,
    },
    {
      title: "Messages",
      url: "/messages",
      icon: MessageSquare,
    },
    {
      title: "Calendar",
      url: "/calendar",
      icon: Calendar,
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: Users,
    },
  ],
  quickAccess: [
    {
      name: "Profile",
      url: "/profile",
      icon: GraduationCap,
    },
  ],
});

export function AppSidebar({ profile, ...props }: { profile: Profile } & React.ComponentProps<typeof Sidebar>) {
  const studentData = createStudentData(profile);
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={studentData.roles} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={studentData.navMain} />
        <NavProjects projects={studentData.quickAccess} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={studentData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
