"use client"

import * as React from "react"
import {
  BookOpen,
  Briefcase,
  Calendar,
  Home,
  Trophy,
  Network,
  Heart,
  UserCheck,
  Building,
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

// Create alumni sidebar data based on profile
const createAlumniData = (profile: Profile) => ({
  user: {
    name: profile.full_name || "Alumni",
    email: profile.email || "alumni@university.edu",
    avatar: "/avatars/alumni.jpg",
  },
  roles: [
    {
      name: "Alumni",
      logo: Trophy,
      plan: `Graduate ${profile.passing_year || '2020'}`,
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard/alumni",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard/alumni",
        },
        {
          title: "My Impact",
          url: "/dashboard/alumni/impact",
        },
        {
          title: "Alumni Network Stats",
          url: "/dashboard/alumni/stats",
        },
      ],
    },
    {
      title: "Networking",
      url: "/networking",
      icon: Network,
      items: [
        {
          title: "Alumni Directory",
          url: "/networking/directory",
        },
        {
          title: "Professional Network",
          url: "/networking/professional",
        },
        {
          title: "Industry Groups",
          url: "/networking/industry",
        },
        {
          title: "Mentorship Network",
          url: "/networking/mentorship",
        },
      ],
    },
    {
      title: "Career Services",
      url: "/career",
      icon: Briefcase,
      items: [
        {
          title: "Job Board",
          url: "/career/jobs",
        },
        {
          title: "Career Counseling",
          url: "/career/counseling",
        },
        {
          title: "Skills Development",
          url: "/career/skills",
        },
        {
          title: "Industry Insights",
          url: "/career/insights",
        },
      ],
    },
    {
      title: "Mentorship",
      url: "/mentorship",
      icon: UserCheck,
      items: [
        {
          title: "My Mentees",
          url: "/mentorship/mentees",
        },
        {
          title: "Mentoring Resources",
          url: "/mentorship/resources",
        },
        {
          title: "Program Guidelines",
          url: "/mentorship/guidelines",
        },
        {
          title: "Success Stories",
          url: "/mentorship/stories",
        },
      ],
    },
    {
      title: "Giving Back",
      url: "/giving",
      icon: Heart,
      items: [
        {
          title: "Donation Portal",
          url: "/giving/donate",
        },
        {
          title: "Scholarship Fund",
          url: "/giving/scholarships",
        },
        {
          title: "Volunteer Opportunities",
          url: "/giving/volunteer",
        },
        {
          title: "My Contributions",
          url: "/giving/contributions",
        },
      ],
    },
  ],
  quickAccess: [
    {
      name: "Alumni Events",
      url: "/events",
      icon: Calendar,
    },
    {
      name: "University News",
      url: "/news",
      icon: BookOpen,
    },
    {
      name: "Business Directory",
      url: "/business",
      icon: Building,
    },
  ],
});

export function AppSidebarAlumni({ profile, ...props }: { profile: Profile } & React.ComponentProps<typeof Sidebar>) {
  const alumniData = createAlumniData(profile);
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={alumniData.roles} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={alumniData.navMain} />
        <NavProjects projects={alumniData.quickAccess} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={alumniData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}