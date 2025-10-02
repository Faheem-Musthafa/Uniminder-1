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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Send, 
  Star, 
  ThumbsUp, 
  ThumbsDown,
  Plus,
  Filter
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const supabase = getSupabase();

export default async function FeedbackPage() {
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

  // Mock feedback data
  const feedbackItems = [
    {
      id: 1,
      type: "course",
      subject: "Data Structures and Algorithms - CS301",
      professor: "Dr. Sarah Johnson",
      rating: 4,
      comment: "Great course! The professor explains complex concepts very clearly.",
      date: "2025-09-25",
      status: "submitted",
      helpful: 12,
      category: "Course Evaluation"
    },
    {
      id: 2,
      type: "facility",
      subject: "Computer Lab 2 - Equipment Issue",
      department: "IT Services",
      rating: 2,
      comment: "Several computers are not working properly. Need maintenance.",
      date: "2025-09-20",
      status: "in-progress",
      helpful: 8,
      category: "Facility Feedback"
    },
    {
      id: 3,
      type: "service",
      subject: "Library Services",
      department: "Library",
      rating: 5,
      comment: "Excellent support from library staff. Very helpful with research.",
      date: "2025-09-15",
      status: "resolved",
      helpful: 15,
      category: "Service Quality"
    },
    {
      id: 4,
      type: "suggestion",
      subject: "Campus Wi-Fi Improvement",
      department: "IT Services",
      rating: 3,
      comment: "Wi-Fi connection is slow in the library. Could be improved.",
      date: "2025-09-10",
      status: "under-review",
      helpful: 23,
      category: "Suggestion"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'secondary';
      case 'in-progress': return 'default';
      case 'resolved': return 'outline';
      case 'under-review': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return '📝';
      case 'in-progress': return '⏳';
      case 'resolved': return '✅';
      case 'under-review': return '👀';
      default: return '📋';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
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
                  <BreadcrumbLink href="/dashboard/student">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Feedback</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Feedback</h1>
              <p className="text-muted-foreground">
                Share your thoughts and help improve the university experience
              </p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Submit Feedback
            </Button>
          </div>

          {/* New Feedback Form */}
          <Card>
            <CardHeader>
              <CardTitle>Submit New Feedback</CardTitle>
              <CardDescription>
                Help us improve by sharing your experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="feedback-type">Feedback Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="course">Course Evaluation</SelectItem>
                        <SelectItem value="facility">Facility Issue</SelectItem>
                        <SelectItem value="service">Service Quality</SelectItem>
                        <SelectItem value="suggestion">Suggestion</SelectItem>
                        <SelectItem value="complaint">Complaint</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input 
                      id="subject"
                      placeholder="Brief description of your feedback"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="rating">Overall Rating</Label>
                  <div className="flex items-center gap-2 mt-2">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className="h-6 w-6 text-gray-300 hover:text-yellow-400 cursor-pointer" />
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">Click to rate</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="comments">Comments</Label>
                  <Textarea 
                    id="comments"
                    placeholder="Please share your detailed feedback..."
                    rows={4}
                  />
                </div>

                <Button className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Submit Feedback
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Feedback Statistics */}
          <div className="grid auto-rows-min gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{feedbackItems.length}</div>
                <p className="text-xs text-muted-foreground">Submissions</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2</div>
                <div className="flex items-center gap-1 mt-1">
                  {renderStars(4)}
                  <span className="text-xs text-muted-foreground ml-1">out of 5</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {feedbackItems.filter(item => item.status === 'resolved').length}
                </div>
                <p className="text-xs text-muted-foreground">Issues fixed</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Helpful Votes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">58</div>
                <p className="text-xs text-muted-foreground">From community</p>
              </CardContent>
            </Card>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">All</Button>
              <Button variant="outline" size="sm">Course</Button>
              <Button variant="outline" size="sm">Facility</Button>
              <Button variant="outline" size="sm">Service</Button>
            </div>
          </div>

          {/* Previous Feedback */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Your Previous Feedback</h2>
            {feedbackItems.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-xl">{getStatusIcon(item.status)}</div>
                        <div>
                          <h3 className="font-semibold">{item.subject}</h3>
                          <p className="text-sm text-muted-foreground">
                            {item.professor || item.department} • {item.category}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1">
                          {renderStars(item.rating)}
                          <span className="text-sm ml-2">{item.rating}/5</span>
                        </div>
                        <Badge variant={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-sm mb-3 line-clamp-2">{item.comment}</p>
                      
                      <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm">
                          <ThumbsUp className="mr-1 h-3 w-3" />
                          {item.helpful}
                        </Button>
                        <Button variant="outline" size="sm">
                          <ThumbsDown className="mr-1 h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="mr-1 h-3 w-3" />
                          View Details
                        </Button>
                      </div>
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