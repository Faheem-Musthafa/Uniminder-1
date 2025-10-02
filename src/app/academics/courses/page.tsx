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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Users, Award } from "lucide-react";

const supabase = getSupabase();

export default async function CoursesPage() {
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

  if (profile.role !== "student") {
    redirect("/dashboard");
  }

  // Mock course data - replace with real data from your database
  const courses = [
    {
      id: 1,
      name: "Data Structures and Algorithms",
      code: "CS301",
      credits: 4,
      instructor: "Dr. Sarah Johnson",
      schedule: "Mon, Wed, Fri 9:00-10:00 AM",
      progress: 75,
      status: "active",
      nextClass: "2025-10-03 09:00:00",
      assignments: 3,
      students: 45
    },
    {
      id: 2,
      name: "Database Management Systems",
      code: "CS401",
      credits: 3,
      instructor: "Prof. Michael Chen",
      schedule: "Tue, Thu 11:00-12:30 PM",
      progress: 60,
      status: "active",
      nextClass: "2025-10-03 11:00:00",
      assignments: 2,
      students: 38
    },
    {
      id: 3,
      name: "Machine Learning Fundamentals",
      code: "CS501",
      credits: 4,
      instructor: "Dr. Emily Rodriguez",
      schedule: "Mon, Wed 2:00-3:30 PM",
      progress: 45,
      status: "active",
      nextClass: "2025-10-03 14:00:00",
      assignments: 4,
      students: 32
    },
    {
      id: 4,
      name: "Software Engineering Principles",
      code: "CS302",
      credits: 3,
      instructor: "Prof. David Kim",
      schedule: "Tue, Thu 3:00-4:30 PM",
      progress: 90,
      status: "completed",
      nextClass: null,
      assignments: 0,
      students: 42
    }
  ];

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
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/academics">Academics</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Courses</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Courses</h1>
              <p className="text-muted-foreground">
                Manage your enrolled courses and track your academic progress
              </p>
            </div>
            <Button>
              <BookOpen className="mr-2 h-4 w-4" />
              Browse Catalog
            </Button>
          </div>

          {/* Course Statistics */}
          <div className="grid auto-rows-min gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{courses.length}</div>
                <p className="text-xs text-muted-foreground">
                  {courses.filter(c => c.status === 'active').length} active
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {courses.reduce((sum, course) => sum + course.credits, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  This semester
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(courses.reduce((sum, course) => sum + course.progress, 0) / courses.length)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all courses
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {courses.reduce((sum, course) => sum + course.assignments, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Due this week
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Course List */}
          <div className="grid gap-4">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{course.name}</CardTitle>
                        <CardDescription>{course.code} • {course.credits} Credits</CardDescription>
                      </div>
                    </div>
                    <Badge variant={course.status === 'active' ? 'default' : 'secondary'}>
                      {course.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Instructor: {course.instructor}</span>
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {course.schedule}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {course.students} students
                        </span>
                        <span className="flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          {course.assignments} assignments
                        </span>
                      </div>
                      <div className="text-sm">
                        Progress: {course.progress}%
                      </div>
                    </div>

                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all" 
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="default">
                        View Course
                      </Button>
                      <Button size="sm" variant="outline">
                        Materials
                      </Button>
                      {course.assignments > 0 && (
                        <Button size="sm" variant="outline">
                          Assignments ({course.assignments})
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}