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

export default function StudentDashboard({ profile }: DashboardProps) {
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
                  <BreadcrumbPage>Student Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
              <div className="text-center">
                <h3 className="font-semibold">Current GPA</h3>
                <p className="text-sm text-muted-foreground">3.78 / 4.0</p>
              </div>
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
              <div className="text-center">
                <h3 className="font-semibold">Credits Earned</h3>
                <p className="text-sm text-muted-foreground">89 / 120</p>
              </div>
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
              <div className="text-center">
                <h3 className="font-semibold">Semester Progress</h3>
                <p className="text-sm text-muted-foreground">75% Complete</p>
              </div>
            </div>
          </div>
          <div className="bg-muted/50 min-h-[50vh] flex-1 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Welcome back, {profile.full_name?.split(' ')[0] || 'Student'}!</h2>
            <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">College:</strong> {profile.college || 'Not specified'} | 
                <strong className="text-foreground">Degree:</strong> {profile.degree || 'Not specified'} | 
                <strong className="text-foreground">Branch:</strong> {profile.branch || 'Not specified'} | 
                <strong className="text-foreground">Year:</strong> {profile.passing_year || 'Not specified'}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Today&apos;s Schedule</h3>
                <ul className="space-y-2 text-sm">
                  <li>• 9:00 AM - Data Structures (CS301)</li>
                  <li>• 11:00 AM - Database Systems (CS401)</li>
                  <li>• 2:00 PM - Machine Learning (CS501)</li>
                  <li>• 4:00 PM - Study Group - Algorithms</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Upcoming Deadlines</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Oct 5 - ML Assignment #3</li>
                  <li>• Oct 8 - Database Project Phase 2</li>
                  <li>• Oct 12 - Data Structures Midterm</li>
                  <li>• Oct 15 - Research Paper Draft</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Recent Achievements</h3>
                <ul className="space-y-2 text-sm">
                  <li>🏆 Dean&apos;s List - Spring 2025</li>
                  <li>🥇 Hackathon Winner - TechFest 2025</li>
                  <li>📚 Completed Advanced Python Course</li>
                  <li>🎯 Perfect Attendance - 4 weeks</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full text-left text-sm p-2 hover:bg-muted rounded transition-colors">
                    📝 Submit Assignment
                  </button>
                  <button className="w-full text-left text-sm p-2 hover:bg-muted rounded transition-colors">
                    📊 Check Grades
                  </button>
                  <button className="w-full text-left text-sm p-2 hover:bg-muted rounded transition-colors">
                    💬 Join Study Group
                  </button>
                  <button className="w-full text-left text-sm p-2 hover:bg-muted rounded transition-colors">
                    📅 View Full Schedule
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
