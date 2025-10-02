"use client"

import * as React from "react"
import {
  BookOpen,
  Calendar,
  GraduationCap,
  Home,
  MessageSquare,
  Users,
  BarChart3,
  Clock,
  Award,
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
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
        {
          title: "Analytics",
          url: "/dashboard/analytics",
        },
        {
          title: "Recent Activity",
          url: "/dashboard/activity",
        },
      ],
    },
    {
      title: "Academics",
      url: "/academics",
      icon: BookOpen,
      items: [
        {
          title: "Courses",
          url: "/academics/courses",
        },
        {
          title: "Assignments",
          url: "/academics/assignments",
        },
        {
          title: "Grades",
          url: "/academics/grades",
        },
        {
          title: "Transcripts",
          url: "/academics/transcripts",
        },
      ],
    },
    {
      title: "Schedule",
      url: "/schedule",
      icon: Calendar,
      items: [
        {
          title: "Timetable",
          url: "/schedule/timetable",
        },
        {
          title: "Exams",
          url: "/schedule/exams",
        },
        {
          title: "Events",
          url: "/schedule/events",
        },
        {
          title: "Deadlines",
          url: "/schedule/deadlines",
        },
      ],
    },
    {
      title: "Communication",
      url: "/communication",
      icon: MessageSquare,
      items: [
        {
          title: "Messages",
          url: "/communication/messages",
        },
        {
          title: "Announcements",
          url: "/communication/announcements",
        },
        {
          title: "Discussion Forum",
          url: "/communication/forum",
        },
        {
          title: "Study Groups",
          url: "/communication/groups",
        },
      ],
    },
    {
      title: "Student Life",
      url: "/student-life",
      icon: Users,
      items: [
        {
          title: "Clubs & Societies",
          url: "/student-life/clubs",
        },
        {
          title: "Events & Activities",
          url: "/student-life/events",
        },
        {
          title: "Sports & Recreation",
          url: "/student-life/sports",
        },
        {
          title: "Wellness Center",
          url: "/student-life/wellness",
        },
      ],
    },
  ],
  quickAccess: [
    {
      name: "Digital Library",
      url: "/library",
      icon: BookOpen,
    },
    {
      name: "Grade Calculator",
      url: "/tools/calculator",
      icon: BarChart3,
    },
    {
      name: "Study Timer",
      url: "/tools/timer",
      icon: Clock,
    },
    {
      name: "Achievement Hub",
      url: "/achievements",
      icon: Award,
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
