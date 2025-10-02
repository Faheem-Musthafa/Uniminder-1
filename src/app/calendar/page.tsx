import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Plus, ChevronLeft, ChevronRight } from "lucide-react";

const supabase = getSupabase();

export default async function CalendarPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (!profile?.onboarded) {
    redirect("/onboarding");
  }

  // Mock calendar events
  const events = [
    {
      id: 1,
      title: "Data Structures Lecture",
      type: "class",
      time: "09:00 - 10:00",
      location: "Room 301",
      date: "2025-10-03",
      color: "blue"
    },
    {
      id: 2,
      title: "Database Systems Lab",
      type: "lab",
      time: "11:00 - 13:00",
      location: "Computer Lab 2",
      date: "2025-10-03",
      color: "green"
    },
    {
      id: 3,
      title: "ML Assignment Due",
      type: "deadline",
      time: "23:59",
      location: "Online Submission",
      date: "2025-10-05",
      color: "red"
    },
    {
      id: 4,
      title: "Study Group Meeting",
      type: "meeting",
      time: "15:00 - 17:00",
      location: "Library Room 205",
      date: "2025-10-04",
      color: "purple"
    },
    {
      id: 5,
      title: "Career Fair",
      type: "event",
      time: "10:00 - 16:00",
      location: "Main Auditorium",
      date: "2025-10-10",
      color: "orange"
    },
    {
      id: 6,
      title: "Midterm Exam - Database",
      type: "exam",
      time: "14:00 - 16:00",
      location: "Exam Hall A",
      date: "2025-10-12",
      color: "red"
    }
  ];

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'class': return 'default';
      case 'lab': return 'secondary';
      case 'deadline': return 'destructive';
      case 'exam': return 'destructive';
      case 'meeting': return 'outline';
      case 'event': return 'default';
      default: return 'outline';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'class': return '📚';
      case 'lab': return '💻';
      case 'deadline': return '⏰';
      case 'exam': return '📝';
      case 'meeting': return '👥';
      case 'event': return '🎉';
      default: return '📅';
    }
  };

  // Get events for today and upcoming days
  const todayEvents = events.filter(event => event.date === today.toISOString().split('T')[0]);
  const upcomingEvents = events.filter(event => new Date(event.date) > today).slice(0, 5);

  return (
    <SidebarProvider>
      <AppSidebar profile={profile} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard/student">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Calendar</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Calendar</h1>
              <p className="text-muted-foreground">
                Manage your schedule, deadlines, and academic events
              </p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </div>

          {/* Calendar Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <CardTitle className="text-2xl">
                    {monthNames[currentMonth]} {currentYear}
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Today</Button>
                  <Button variant="outline" size="sm">Week</Button>
                  <Button variant="outline" size="sm">Month</Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Today's Events & Statistics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Today&apos;s Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todayEvents.length}</div>
                <p className="text-xs text-muted-foreground">Scheduled today</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Classes & labs</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Deadlines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">3</div>
                <p className="text-xs text-muted-foreground">Due this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Free Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">6</div>
                <p className="text-xs text-muted-foreground">Available today</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Today&apos;s Schedule
                </CardTitle>
                <CardDescription>
                  {today.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todayEvents.length > 0 ? (
                    todayEvents.map((event) => (
                      <div key={event.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="text-2xl">{getEventTypeIcon(event.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{event.title}</h4>
                            <Badge variant={getEventTypeColor(event.type)} className="text-xs">
                              {event.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {event.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No events scheduled for today</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Upcoming Events
                </CardTitle>
                <CardDescription>Next few days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="text-2xl">{getEventTypeIcon(event.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{event.title}</h4>
                          <Badge variant={getEventTypeColor(event.type)} className="text-xs">
                            {event.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {event.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your calendar efficiently</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
                <Button variant="outline" className="justify-start">
                  📚 Add Study Session
                </Button>
                <Button variant="outline" className="justify-start">
                  ⏰ Set Reminder
                </Button>
                <Button variant="outline" className="justify-start">
                  👥 Schedule Meeting
                </Button>
                <Button variant="outline" className="justify-start">
                  📅 View Full Calendar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}