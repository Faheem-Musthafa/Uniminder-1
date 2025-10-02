"use client"

import * as React from "react"
import {
  Target,
  Home,
  Users,
  Brain,
  Award,
  TrendingUp,
  Clock,
  CheckSquare,
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

// Create aspirant sidebar data based on profile
const createAspirantData = (profile: Profile) => ({
  user: {
    name: profile.full_name || "Aspirant",
    email: profile.email || "aspirant@example.com",
    avatar: "/avatars/aspirant.jpg",
  },
  roles: [
    {
      name: "Aspirant",
      logo: Brain,
      plan: profile.entrance_exam || "Preparing",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard/aspirant",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard/aspirant",
        },
        {
          title: "Progress Tracker",
          url: "/dashboard/aspirant/progress",
        },
        {
          title: "Goal Analytics",
          url: "/dashboard/aspirant/analytics",
        },
      ],
    },
    {
      title: "Test Preparation",
      url: "/preparation",
      icon: Brain,
      items: [
        {
          title: "Study Materials",
          url: "/preparation/materials",
        },
        {
          title: "Practice Tests",
          url: "/preparation/tests",
        },
        {
          title: "Mock Exams",
          url: "/preparation/mocks",
        },
        {
          title: "Previous Papers",
          url: "/preparation/papers",
        },
      ],
    },
    {
      title: "Learning Path",
      url: "/learning",
      icon: Target,
      items: [
        {
          title: "Course Roadmap",
          url: "/learning/roadmap",
        },
        {
          title: "Video Lectures",
          url: "/learning/videos",
        },
        {
          title: "Interactive Quizzes",
          url: "/learning/quizzes",
        },
        {
          title: "Study Schedules",
          url: "/learning/schedules",
        },
      ],
    },
    {
      title: "Performance",
      url: "/performance",
      icon: TrendingUp,
      items: [
        {
          title: "Test Results",
          url: "/performance/results",
        },
        {
          title: "Score Analysis",
          url: "/performance/analysis",
        },
        {
          title: "Weak Areas",
          url: "/performance/weaknesses",
        },
        {
          title: "Improvement Plans",
          url: "/performance/plans",
        },
      ],
    },
    {
      title: "Community",
      url: "/community",
      icon: Users,
      items: [
        {
          title: "Study Groups",
          url: "/community/groups",
        },
        {
          title: "Discussion Forums",
          url: "/community/forums",
        },
        {
          title: "Peer Connect",
          url: "/community/peers",
        },
        {
          title: "Success Stories",
          url: "/community/stories",
        },
      ],
    },
  ],
  quickAccess: [
    {
      name: "Daily Tasks",
      url: "/tasks",
      icon: CheckSquare,
    },
    {
      name: "Study Timer",
      url: "/timer",
      icon: Clock,
    },
    {
      name: "Achievement Board",
      url: "/achievements",
      icon: Award,
    },
  ],
});

export function AppSidebarAspirant({ profile, ...props }: { profile: Profile } & React.ComponentProps<typeof Sidebar>) {
  const aspirantData = createAspirantData(profile);
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={aspirantData.roles} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={aspirantData.navMain} />
        <NavProjects projects={aspirantData.quickAccess} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={aspirantData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}