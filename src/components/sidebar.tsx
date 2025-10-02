"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";

import {
  Home,
  BookOpen,
  Calendar,
  FileText,
  MessageSquare,
  Settings,
  User2,
  LogOut,
} from "lucide-react";

// Student menu items
const mainMenu = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Courses", url: "/courses", icon: BookOpen },
  { title: "Assignments", url: "/assignments", icon: FileText },
  { title: "Timetable", url: "/timetable", icon: Calendar },
  { title: "Messages", url: "/messages", icon: MessageSquare },
];

export function AppSidebar() {
  const pathname = usePathname(); // get current route for active state

  return (
    <Sidebar collapsible="icon">
      {/* Header */}
      <SidebarHeader>
        <div className="flex items-center gap-2 font-semibold text-lg">
          🎓 Uniminder
        </div>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Student</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenu.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.url}>
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Settings Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/profile"}>
                  <Link href="/profile">
                    <User2 className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/settings"}>
                  <Link href="/settings">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with Logout */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                onClick={() => {
                  // Example logout logic
                  console.log("Logging out…");
                  window.location.href = "/login";
                }}
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
