"use client"

import * as React from "react"
import {
  Calendar,
  GraduationCap,
  Home,
  MessageSquare,
  Users,
  Briefcase,
  Plus,
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

// Create sidebar data based on profile role
const createSidebarData = (profile: Profile) => {
  const baseUser = {
    name: profile.full_name || "User",
    email: profile.email || "user@university.edu",
    avatar: profile.avatar_url || "/avatars/default.jpg",
  };

  const baseQuickAccess = [
    {
      name: "Profile",
      url: "/profile",
      icon: GraduationCap,
    },
  ];

  // Student navigation
  if (profile.role === 'student') {
    return {
      user: baseUser,
      roles: [{
        name: "Student",
        logo: GraduationCap,
        plan: profile.college || "Active",
      }],
      navMain: [
        {
          title: "Overview",
          url: "/dashboard/student",
          icon: Home,
          isActive: true,
        },
        {
          title: "Job Posts",
          url: "/posts",
          icon: Briefcase,
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
      quickAccess: baseQuickAccess,
    };
  }

  // Alumni navigation
  if (profile.role === 'alumni') {
    return {
      user: baseUser,
      roles: [{
        name: "Alumni",
        logo: GraduationCap,
        plan: profile.company || "Professional",
      }],
      navMain: [
        {
          title: "Overview",
          url: "/dashboard/alumni",
          icon: Home,
          isActive: true,
        },
        {
          title: "My Posts",
          url: "/posts",
          icon: Briefcase,
        },
        {
          title: "Create Post",
          url: "/posts/create",
          icon: Plus,
        },
        {
          title: "Messages",
          url: "/messages",
          icon: MessageSquare,
        },
        {
          title: "Mentorship",
          url: "/mentorship",
          icon: Users,
        },
      ],
      quickAccess: baseQuickAccess,
    };
  }

  // Aspirant navigation
  if (profile.role === 'aspirant') {
    return {
      user: baseUser,
      roles: [{
        name: "Aspirant",
        logo: GraduationCap,
        plan: profile.target_college || "Preparing",
      }],
      navMain: [
        {
          title: "Overview",
          url: "/dashboard/aspirant",
          icon: Home,
          isActive: true,
        },
        {
          title: "Resources",
          url: "/posts",
          icon: Briefcase,
        },
        {
          title: "Messages",
          url: "/messages",
          icon: MessageSquare,
        },
        {
          title: "Guidance",
          url: "/guidance",
          icon: Users,
        },
      ],
      quickAccess: baseQuickAccess,
    };
  }

  // Default fallback
  return {
    user: baseUser,
    roles: [{
      name: "User",
      logo: GraduationCap,
      plan: "Active",
    }],
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
        isActive: true,
      },
    ],
    quickAccess: baseQuickAccess,
  };
};

export function AppSidebar({ profile, ...props }: { profile: Profile } & React.ComponentProps<typeof Sidebar>) {
  const sidebarData = createSidebarData(profile);
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.roles} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarData.navMain} />
        <NavProjects projects={sidebarData.quickAccess} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
