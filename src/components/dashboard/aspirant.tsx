import { DashboardProps } from "@/types";
import { AppSidebarAspirant } from "../app-sidebar-aspirant";
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

export default function AspirantDashboard({ profile }: DashboardProps) {
  return (
    <>
      <AppSidebarAspirant profile={profile} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Aspirant Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
              <div className="text-center">
                <h3 className="font-semibold">Study Streak</h3>
                <p className="text-sm text-muted-foreground">15 days</p>
              </div>
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
              <div className="text-center">
                <h3 className="font-semibold">Mock Tests</h3>
                <p className="text-sm text-muted-foreground">23 completed</p>
              </div>
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
              <div className="text-center">
                <h3 className="font-semibold">Target Score</h3>
                <p className="text-sm text-muted-foreground">320/340</p>
              </div>
            </div>
          </div>
          <div className="bg-muted/50 min-h-[50vh] flex-1 rounded-xl p-6">
                        <h2 className="text-2xl font-bold mb-4">Welcome back, {profile.full_name}!</h2>
            <div className="mb-6 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Target Exam:</strong> {profile.entrance_exam || 'Not specified'} | 
                <strong>Target College:</strong> {profile.target_college || 'Not specified'} | 
                <strong>Target Year:</strong> {profile.passing_year || 'Not specified'}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Today&apos;s Study Plan</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Complete Quantitative Reasoning - 2 hours</li>
                  <li>• Verbal Practice - 1 hour</li>
                  <li>• Mock Test Review - 30 minutes</li>
                  <li>• Vocabulary Building - 30 minutes</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Recent Progress</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Improved Quant score by 15 points</li>
                  <li>• Completed 5 practice tests this week</li>
                  <li>• Mastered 50 new vocabulary words</li>
                  <li>• Joined study group discussions</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Upcoming Milestones</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Full-length Mock Test - Oct 5</li>
                  <li>• College Application Deadline - Oct 15</li>
                  <li>• Official Test Date - Nov 2</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full text-left text-sm p-2 hover:bg-gray-100 rounded">
                    📚 Start Daily Practice
                  </button>
                  <button className="w-full text-left text-sm p-2 hover:bg-gray-100 rounded">
                    📊 Review Last Test
                  </button>
                  <button className="w-full text-left text-sm p-2 hover:bg-gray-100 rounded">
                    👥 Join Study Group
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  );
}
