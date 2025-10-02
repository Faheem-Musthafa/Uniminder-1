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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Search, Plus } from "lucide-react";

const supabase = getSupabase();

export default async function MessagesPage() {
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

  // Mock messages data
  const conversations = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      role: "Professor",
      lastMessage: "Great work on your assignment! Please see me during office hours for feedback.",
      timestamp: "2 hours ago",
      unread: true,
      avatar: "/avatars/professor1.jpg"
    },
    {
      id: 2,
      name: "Study Group - CS301",
      role: "Group",
      lastMessage: "Meeting tomorrow at 3 PM in library room 205",
      timestamp: "4 hours ago",
      unread: false,
      avatar: "/avatars/group.jpg"
    },
    {
      id: 3,
      name: "Academic Advisor",
      role: "Staff",
      lastMessage: "Your course registration for next semester is due soon",
      timestamp: "1 day ago",
      unread: true,
      avatar: "/avatars/advisor.jpg"
    },
    {
      id: 4,
      name: "Michael Chen",
      role: "Classmate",
      lastMessage: "Can you share the notes from today's lecture?",
      timestamp: "2 days ago",
      unread: false,
      avatar: "/avatars/student1.jpg"
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
                  <BreadcrumbLink href="/dashboard/student">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Messages</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Messages</h1>
              <p className="text-muted-foreground">
                Stay connected with professors, classmates, and staff
              </p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Message
            </Button>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-10"
            />
          </div>

          {/* Message Statistics */}
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{conversations.length}</div>
                <p className="text-xs text-muted-foreground">Active chats</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {conversations.filter(c => c.unread).length}
                </div>
                <p className="text-xs text-muted-foreground">Need attention</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Quick Reply</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">5</div>
                <p className="text-xs text-muted-foreground">Templates available</p>
              </CardContent>
            </Card>
          </div>

          {/* Conversations List */}
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <Card key={conversation.id} className={`hover:shadow-md transition-shadow cursor-pointer ${conversation.unread ? 'border-primary/50 bg-primary/5' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={conversation.avatar} alt={conversation.name} />
                      <AvatarFallback>
                        {conversation.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">{conversation.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {conversation.role}
                          </Badge>
                          {conversation.unread && (
                            <div className="h-2 w-2 bg-primary rounded-full"></div>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {conversation.timestamp}
                        </span>
                      </div>
                      
                      <p className={`text-sm mt-1 truncate ${conversation.unread ? 'font-medium' : 'text-muted-foreground'}`}>
                        {conversation.lastMessage}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <MessageCircle className="h-3 w-3" />
                      </Button>
                      <Button size="sm">
                        <Send className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>Common messaging tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
                <Button variant="outline" className="justify-start">
                  📧 Email Professor
                </Button>
                <Button variant="outline" className="justify-start">
                  👥 Join Study Group
                </Button>
                <Button variant="outline" className="justify-start">
                  📅 Schedule Meeting
                </Button>
                <Button variant="outline" className="justify-start">
                  🔔 Set Reminders
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}