import { DashboardProps } from "@/types";
import { AppSidebarAlumni } from "../app-sidebar-alumni";
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

export default function AlumniDashboard({ profile }: DashboardProps) {
  return (
    <>
      <AppSidebarAlumni profile={profile} />
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
                <h3 className="font-semibold">Network Impact</h3>
                <p className="text-sm text-muted-foreground">125 connections</p>
              </div>
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
              <div className="text-center">
                <h3 className="font-semibold">Mentees Guided</h3>
                <p className="text-sm text-muted-foreground">8 students</p>
              </div>
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
              <div className="text-center">
                <h3 className="font-semibold">Contributions</h3>
                <p className="text-sm text-muted-foreground">$5,200 donated</p>
              </div>
            </div>
          </div>
          <div className="bg-muted/50 min-h-[50vh] flex-1 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Welcome back, {profile.full_name}!</h2>
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>College:</strong> {profile.college || 'Not specified'} | 
                <strong>Graduation:</strong> {profile.passing_year || 'Not specified'} | 
                <strong>Company:</strong> {profile.company || 'Not specified'}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Recent Alumni Activities</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Mentored 2 new students this month</li>
                  <li>• Attended Virtual Networking Event</li>
                  <li>• Updated professional profile</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Upcoming Events</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Alumni Reunion - Oct 15</li>
                  <li>• Career Fair - Oct 22</li>
                  <li>• Mentorship Workshop - Oct 28</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  );
}
