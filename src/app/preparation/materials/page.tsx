import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebarAspirant } from "@/components/app-sidebar-aspirant";
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
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Video, 
  FileText, 
  Calculator, 
  Search,
  Download,
  Star,
  Clock,
  Users
} from "lucide-react";

const supabase = getSupabase();

export default async function StudyMaterialsPage() {
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

  if (profile.role !== "aspirant") {
    redirect("/dashboard");
  }

  // Mock study materials data
  const materials = [
    {
      id: 1,
      title: "GRE Quantitative Reasoning Complete Guide",
      type: "pdf",
      category: "Quantitative",
      difficulty: "intermediate",
      pages: 350,
      rating: 4.8,
      downloads: 2543,
      lastUpdated: "2025-09-15",
      author: "Expert Faculty Team",
      description: "Comprehensive guide covering all GRE Quant topics with practice problems",
      tags: ["algebra", "geometry", "data-analysis"]
    },
    {
      id: 2,
      title: "Verbal Reasoning Video Masterclass",
      type: "video",
      category: "Verbal",
      difficulty: "advanced",
      duration: "8h 45m",
      rating: 4.9,
      views: 15680,
      lastUpdated: "2025-09-20",
      author: "Dr. Sarah Martinez",
      description: "Advanced strategies for reading comprehension and critical reasoning",
      tags: ["reading-comprehension", "critical-reasoning", "vocabulary"]
    },
    {
      id: 3,
      title: "AWA Essay Writing Templates",
      type: "template",
      category: "Writing",
      difficulty: "beginner",
      pages: 45,
      rating: 4.6,
      downloads: 1820,
      lastUpdated: "2025-09-10",
      author: "Writing Experts",
      description: "Proven templates and sample essays for analytical writing",
      tags: ["essay-writing", "templates", "analysis"]
    },
    {
      id: 4,
      title: "Interactive Math Problem Solver",
      type: "interactive",
      category: "Quantitative",
      difficulty: "all-levels",
      problems: 500,
      rating: 4.7,
      users: 8934,
      lastUpdated: "2025-09-25",
      author: "MathGenius Inc.",
      description: "Step-by-step solutions for quantitative problems with explanations",
      tags: ["problem-solving", "step-by-step", "practice"]
    },
    {
      id: 5,
      title: "Vocabulary Builder Flashcards",
      type: "flashcards",
      category: "Verbal",
      difficulty: "intermediate",
      cards: 2000,
      rating: 4.5,
      downloads: 3421,
      lastUpdated: "2025-09-18",
      author: "Vocab Masters",
      description: "High-frequency GRE vocabulary with mnemonics and examples",
      tags: ["vocabulary", "flashcards", "memory-techniques"]
    },
    {
      id: 6,
      title: "Practice Test Analytics Report",
      type: "report",
      category: "Analytics",
      difficulty: "intermediate",
      pages: 120,
      rating: 4.4,
      downloads: 967,
      lastUpdated: "2025-09-22",
      author: "Test Prep Analytics",
      description: "Detailed analysis of common mistakes and improvement strategies",
      tags: ["analytics", "performance", "improvement"]
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return FileText;
      case 'video': return Video;
      case 'template': return BookOpen;
      case 'interactive': return Calculator;
      case 'flashcards': return BookOpen;
      case 'report': return FileText;
      default: return FileText;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'default';
      case 'intermediate': return 'secondary';
      case 'advanced': return 'destructive';
      case 'all-levels': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <SidebarProvider>
      <AppSidebarAspirant profile={profile} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard/aspirant">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/preparation">Test Preparation</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Study Materials</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Study Materials</h1>
              <p className="text-muted-foreground">
                Access comprehensive study resources for your test preparation
              </p>
            </div>
            <Button>
              <BookOpen className="mr-2 h-4 w-4" />
              Upload Material
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search materials..."
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">All Categories</Button>
              <Button variant="outline" size="sm">Quantitative</Button>
              <Button variant="outline" size="sm">Verbal</Button>
              <Button variant="outline" size="sm">Writing</Button>
            </div>
          </div>

          {/* Material Statistics */}
          <div className="grid auto-rows-min gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Materials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{materials.length}</div>
                <p className="text-xs text-muted-foreground">
                  Available resources
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Downloaded</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  In your library
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Favorites</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">
                  Bookmarked
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-muted-foreground">
                  This week
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Materials Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {materials.map((material) => {
              const TypeIcon = getTypeIcon(material.type);
              
              return (
                <Card key={material.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <TypeIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-base line-clamp-2">{material.title}</CardTitle>
                          <CardDescription className="mt-1">
                            by {material.author}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <Badge>{material.category}</Badge>
                      <Badge variant={getDifficultyColor(material.difficulty)}>
                        {material.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {material.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{material.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {material.type === 'video' ? (
                            <>
                              <Clock className="h-3 w-3" />
                              <span>{material.duration}</span>
                            </>
                          ) : material.type === 'interactive' ? (
                            <>
                              <Users className="h-3 w-3" />
                              <span>{material.users} users</span>
                            </>
                          ) : (
                            <>
                              <Download className="h-3 w-3" />
                              <span>{material.downloads}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {material.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {material.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{material.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="flex-1">
                          {material.type === 'video' ? 'Watch' : 
                           material.type === 'interactive' ? 'Launch' : 'Download'}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Star className="h-3 w-3" />
                        </Button>
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