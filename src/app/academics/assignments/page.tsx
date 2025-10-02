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
import { CalendarDays, Clock, FileText, AlertCircle } from "lucide-react";

const supabase = getSupabase();

export default async function AssignmentsPage() {
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

  // Mock assignment data
  const assignments = [
    {
      id: 1,
      title: "Machine Learning Assignment #3",
      course: "CS501",
      courseName: "Machine Learning Fundamentals",
      dueDate: "2025-10-05",
      dueTime: "23:59",
      status: "pending",
      priority: "high",
      description: "Implement a neural network classifier using TensorFlow",
      estimatedHours: 8,
      completedHours: 3,
      submissionFormat: "Python notebook + Report"
    },
    {
      id: 2,
      title: "Database Project Phase 2",
      course: "CS401",
      courseName: "Database Management Systems",
      dueDate: "2025-10-08",
      dueTime: "18:00",
      status: "in-progress",
      priority: "high",
      description: "Design and implement normalized database schema",
      estimatedHours: 12,
      completedHours: 7,
      submissionFormat: "SQL files + Documentation"
    },
    {
      id: 3,
      title: "Algorithm Analysis Report",
      course: "CS301",
      courseName: "Data Structures and Algorithms",
      dueDate: "2025-10-12",
      dueTime: "23:59",
      status: "pending",
      priority: "medium",
      description: "Compare time complexity of sorting algorithms",
      estimatedHours: 6,
      completedHours: 0,
      submissionFormat: "PDF Report"
    },
    {
      id: 4,
      title: "System Design Presentation",
      course: "CS302",
      courseName: "Software Engineering Principles",
      dueDate: "2025-10-15",
      dueTime: "10:00",
      status: "completed",
      priority: "medium",
      description: "Present scalable system architecture design",
      estimatedHours: 10,
      completedHours: 10,
      submissionFormat: "Presentation + Code"
    }
  ];

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in-progress': return 'secondary';
      case 'pending': return 'outline';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

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
                  <BreadcrumbPage>Assignments</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Assignments</h1>
              <p className="text-muted-foreground">
                Track and manage your academic assignments
              </p>
            </div>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Submit Assignment
            </Button>
          </div>

          {/* Assignment Statistics */}
          <div className="grid auto-rows-min gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{assignments.length}</div>
                <p className="text-xs text-muted-foreground">
                  This semester
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {assignments.filter(a => a.status === 'pending').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Not started
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {assignments.filter(a => a.status === 'in-progress').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently working
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {assignments.filter(a => a.status === 'completed').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Finished
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Assignment List */}
          <div className="grid gap-4">
            {assignments.map((assignment) => {
              const daysUntilDue = getDaysUntilDue(assignment.dueDate);
              const progressPercent = (assignment.completedHours / assignment.estimatedHours) * 100;
              
              return (
                <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{assignment.title}</CardTitle>
                          <CardDescription>
                            {assignment.course} • {assignment.courseName}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getPriorityColor(assignment.priority)}>
                          {assignment.priority}
                        </Badge>
                        <Badge variant={getStatusColor(assignment.status)}>
                          {assignment.status}
                        </Badge>
                        {daysUntilDue <= 3 && daysUntilDue > 0 && (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Due Soon
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {assignment.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <CalendarDays className="h-3 w-3" />
                          Due: {new Date(assignment.dueDate).toLocaleDateString()} at {assignment.dueTime}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {assignment.completedHours}h / {assignment.estimatedHours}h
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{Math.round(progressPercent)}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all" 
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Submit as: {assignment.submissionFormat}
                        </span>
                        <div className="text-sm font-medium">
                          {daysUntilDue > 0 ? (
                            <span className="text-orange-600">{daysUntilDue} days left</span>
                          ) : daysUntilDue === 0 ? (
                            <span className="text-red-600">Due Today!</span>
                          ) : (
                            <span className="text-red-600">Overdue</span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="default">
                          {assignment.status === 'completed' ? 'View Submission' : 'Work on Assignment'}
                        </Button>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        {assignment.status !== 'completed' && (
                          <Button size="sm" variant="outline">
                            Update Progress
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}