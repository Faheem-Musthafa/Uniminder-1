import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebarAlumni } from "@/components/app-sidebar-alumni";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Network, 
  MapPin, 
  Building, 
  GraduationCap,
  Search,
  MessageCircle,
  UserPlus,
  Briefcase,
  Calendar
} from "lucide-react";

const supabase = getSupabase();

export default async function NetworkingPage() {
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

  if (profile.role !== "alumni") {
    redirect("/dashboard");
  }

  // Mock alumni network data
  const networkData = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Senior Software Engineer",
      company: "Google",
      location: "San Francisco, CA",
      graduationYear: "2019",
      degree: "Computer Science",
      avatar: "/avatars/sarah.jpg",
      skills: ["React", "Node.js", "Python", "Machine Learning"],
      isOnline: true,
      lastActive: "2 hours ago",
      connections: 245,
      mentees: 8,
      bio: "Passionate about building scalable web applications and mentoring aspiring developers."
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "Product Manager",
      company: "Microsoft",
      location: "Seattle, WA",
      graduationYear: "2018",
      degree: "Business Administration",
      avatar: "/avatars/michael.jpg",
      skills: ["Product Strategy", "Data Analysis", "Agile", "Leadership"],
      isOnline: false,
      lastActive: "1 day ago",
      connections: 189,
      mentees: 12,
      bio: "Building products that make a difference. Always happy to help fellow alumni."
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      title: "UX Design Lead",
      company: "Airbnb",
      location: "Austin, TX",
      graduationYear: "2020",
      degree: "Design Technology",
      avatar: "/avatars/emily.jpg",
      skills: ["UI/UX Design", "Figma", "User Research", "Design Systems"],
      isOnline: true,
      lastActive: "30 minutes ago",
      connections: 167,
      mentees: 6,
      bio: "Creating user-centered designs. Love connecting with design students and new graduates."
    },
    {
      id: 4,
      name: "David Kim",
      title: "Data Scientist",
      company: "Netflix",
      location: "Los Angeles, CA",
      graduationYear: "2017",
      degree: "Mathematics",
      avatar: "/avatars/david.jpg",
      skills: ["Python", "R", "SQL", "Machine Learning", "Statistics"],
      isOnline: false,
      lastActive: "3 hours ago",
      connections: 203,
      mentees: 15,
      bio: "Turning data into insights. Happy to share knowledge about data science career paths."
    },
    {
      id: 5,
      name: "Lisa Thompson",
      title: "Marketing Director",
      company: "Tesla",
      location: "Palo Alto, CA",
      graduationYear: "2016",
      degree: "Marketing",
      avatar: "/avatars/lisa.jpg",
      skills: ["Digital Marketing", "Brand Strategy", "Content", "Analytics"],
      isOnline: true,
      lastActive: "1 hour ago",
      connections: 298,
      mentees: 10,
      bio: "Building brands that inspire. Passionate about helping alumni grow in marketing roles."
    },
    {
      id: 6,
      name: "James Wilson",
      title: "Investment Analyst",
      company: "Goldman Sachs",
      location: "New York, NY",
      graduationYear: "2019",
      degree: "Finance",
      avatar: "/avatars/james.jpg",
      skills: ["Financial Analysis", "Excel", "Bloomberg", "Risk Management"],
      isOnline: false,
      lastActive: "5 hours ago",
      connections: 156,
      mentees: 4,
      bio: "Analyzing markets and investments. Open to discussing finance career opportunities."
    }
  ];

  return (
    <SidebarProvider>
      <AppSidebarAlumni profile={profile} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard/alumni">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/networking">Networking</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Alumni Directory</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Alumni Network</h1>
              <p className="text-muted-foreground">
                Connect with fellow alumni and expand your professional network
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Events
              </Button>
              <Button>
                <Network className="mr-2 h-4 w-4" />
                Join Group
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search alumni by name, company, or skills..."
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">All Locations</Button>
              <Button variant="outline" size="sm">All Industries</Button>
              <Button variant="outline" size="sm">All Years</Button>
            </div>
          </div>

          {/* Network Statistics */}
          <div className="grid auto-rows-min gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Alumni</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847</div>
                <p className="text-xs text-muted-foreground">
                  In network
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Your Connections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">
                  Direct connections
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Active Mentors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-xs text-muted-foreground">
                  Currently mentoring
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Recent Graduates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">234</div>
                <p className="text-xs text-muted-foreground">
                  Class of 2024-25
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Alumni Directory */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {networkData.map((alumni) => (
              <Card key={alumni.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={alumni.avatar} alt={alumni.name} />
                        <AvatarFallback>
                          {alumni.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {alumni.isOnline && (
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-background"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{alumni.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {alumni.title} at {alumni.company}
                      </CardDescription>
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <GraduationCap className="h-3 w-3" />
                        <span>Class of {alumni.graduationYear}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {alumni.bio}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{alumni.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        <span>{alumni.degree}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {alumni.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {alumni.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{alumni.skills.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{alumni.connections} connections</span>
                      <span>Mentoring {alumni.mentees} students</span>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <UserPlus className="mr-2 h-3 w-3" />
                        Connect
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Briefcase className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="text-xs text-muted-foreground text-center">
                      {alumni.isOnline ? 'Online now' : `Last active ${alumni.lastActive}`}
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