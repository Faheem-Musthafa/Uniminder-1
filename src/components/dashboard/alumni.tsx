import { DashboardProps } from "@/types";
import { AppSidebar } from "../app-sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, Users, Briefcase, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function AlumniDashboard({ profile }: DashboardProps) {
  return (
    <>
      <AppSidebar profile={profile} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Alumni Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <h3 className="font-semibold">Posts Created</h3>
                <p className="text-sm text-muted-foreground">12 this month</p>
              </div>
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
              <div className="text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <h3 className="font-semibold">Students Helped</h3>
                <p className="text-sm text-muted-foreground">47 connections</p>
              </div>
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <h3 className="font-semibold">Messages</h3>
                <p className="text-sm text-muted-foreground">23 unread</p>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/50 min-h-[50vh] flex-1 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Welcome back, {profile.full_name?.split(' ')[0] || 'Alumni'}!</h2>
                <p className="text-muted-foreground mt-1">
                  {profile.designation && profile.company 
                    ? `${profile.designation} at ${profile.company}`
                    : profile.company || 'Professional'
                  }
                </p>
              </div>
              <Button asChild>
                <Link href="/posts/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Post
                </Link>
              </Button>
            </div>

            <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm">
                <strong className="text-foreground">Impact:</strong> Share opportunities, mentor students, and build meaningful connections with the next generation of professionals.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/posts/create">
                      <Briefcase className="mr-2 h-4 w-4" />
                      Share Job Opportunity
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/messages">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Reply to Messages
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/mentorship">
                      <Users className="mr-2 h-4 w-4" />
                      View Mentorship Requests
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm font-medium">New mentorship request</p>
                    <p className="text-xs text-muted-foreground">from Rahul Kumar • 2 hours ago</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm font-medium">Post got 5 new applications</p>
                    <p className="text-xs text-muted-foreground">Software Engineer at TechCorp • 4 hours ago</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm font-medium">Message from Priya Singh</p>
                    <p className="text-xs text-muted-foreground">Thanks for the referral! • Yesterday</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  );
}