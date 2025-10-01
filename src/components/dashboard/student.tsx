"use client";

import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import {
  BarChart3,
  Bell,
  BookOpen,
  Briefcase,
  Calendar,
  ChevronRight,
  Clock,
  GraduationCap,
  MessageSquare,
  Search,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Profile } from "@/types";

interface StudentDashboardProps {
  profile?: Profile | null;
}

export default function StudentDashboard({ profile }: StudentDashboardProps) {
  const initials =
    profile?.full_name
      ?.split(" ")
      .filter(Boolean)
      .map((name) => name[0]?.toUpperCase())
      .join("") || "ST";

  const firstName = profile?.full_name?.split(" ")[0] || "there";

  const courses = [
    {
      name: "Data Structures & Algorithms",
      code: "CS301",
      progress: 75,
      grade: "A-",
      nextClass: "Today, 2:00 PM",
    },
    {
      name: "Database Management Systems",
      code: "CS302",
      progress: 60,
      grade: "B+",
      nextClass: "Tomorrow, 10:00 AM",
    },
    {
      name: "Software Engineering",
      code: "CS303",
      progress: 85,
      grade: "A",
      nextClass: "Thursday, 11:00 AM",
    },
    {
      name: "Computer Networks",
      code: "CS304",
      progress: 45,
      grade: "B",
      nextClass: "Friday, 3:00 PM",
    },
  ];

  const upcomingEvents = [
    {
      title: "Database Exam",
      time: "Tomorrow, 10:00 AM",
      border: "border-red-500",
      bg: "bg-red-50 dark:bg-red-900/20",
      text: "text-red-600 dark:text-red-300",
    },
    {
      title: "Project Submission",
      time: "Friday, 11:59 PM",
      border: "border-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      text: "text-blue-600 dark:text-blue-300",
    },
    {
      title: "Career Fair",
      time: "Next Monday",
      border: "border-green-500",
      bg: "bg-green-50 dark:bg-green-900/20",
      text: "text-green-600 dark:text-green-300",
    },
    {
      title: "Mentor Session",
      time: "Wednesday, 3:00 PM",
      border: "border-purple-500",
      bg: "bg-purple-50 dark:bg-purple-900/20",
      text: "text-purple-600 dark:text-purple-300",
    },
  ];

  const quickActions = [
    {
      label: "Messages",
      icon: MessageSquare,
      className:
        "hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300",
      iconClass: "text-blue-600",
      href: "/messages",
    },
    {
      label: "Find Mentors",
      icon: Users,
      className:
        "hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300",
      iconClass: "text-purple-600",
    },
    {
      label: "Study Groups",
      icon: BookOpen,
      className:
        "hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300",
      iconClass: "text-green-600",
    },
    {
      label: "Job Board",
      icon: Briefcase,
      className:
        "hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-300",
      iconClass: "text-orange-600",
    },
    {
      label: "My Progress",
      icon: TrendingUp,
      className:
        "hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:border-pink-300",
      iconClass: "text-pink-600",
    },
    {
      label: "Schedule",
      icon: Calendar,
      className:
        "hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-300",
      iconClass: "text-indigo-600",
    },
  ];

  const activityFeed = [
    {
      icon: Trophy,
      text: "Completed Data Structures Assignment",
      time: "2 hours ago",
      badgeClass: "bg-blue-100 dark:bg-blue-900/30 text-blue-600",
    },
    {
      icon: Star,
      text: "Received A grade in Software Engineering",
      time: "Yesterday",
      badgeClass: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600",
    },
    {
      icon: Users,
      text: "Connected with 3 new mentors",
      time: "2 days ago",
      badgeClass: "bg-green-100 dark:bg-green-900/30 text-green-600",
    },
    {
      icon: MessageSquare,
      text: "5 new messages in study group",
      time: "3 days ago",
      badgeClass: "bg-purple-100 dark:bg-purple-900/30 text-purple-600",
    },
  ];

  const degreeBranch = (() => {
    const degree = profile?.degree?.trim();
    const branch = profile?.branch?.trim();

    if (!degree && !branch) return "Not specified";
    if (!degree) return branch ?? "Not specified";
    if (!branch) return degree;
    return `${degree} in ${branch}`;
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
                UniMinder
              </span>
            </Link>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              Student
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </Button>
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-sm text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <SignOutButton>
              <Button variant="outline" size="sm">
                Sign Out
              </Button>
            </SignOutButton>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here&apos;s what&apos;s happening with your academic journey today.
          </p>
        </section>

        <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-100">Current CGPA</p>
                  <p className="text-3xl font-bold">8.2</p>
                  <p className="mt-1 text-xs text-blue-100">↑ 0.3 from last sem</p>
                </div>
                <Trophy className="h-10 w-10 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-100">Active Courses</p>
                  <p className="text-3xl font-bold">6</p>
                  <p className="mt-1 text-xs text-purple-100">2 assignments pending</p>
                </div>
                <BookOpen className="h-10 w-10 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-100">Mentors</p>
                  <p className="text-3xl font-bold">5</p>
                  <p className="mt-1 text-xs text-green-100">3 sessions this week</p>
                </div>
                <Users className="h-10 w-10 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-100">Attendance</p>
                  <p className="text-3xl font-bold">85%</p>
                  <p className="mt-1 text-xs text-orange-100">10 days this month</p>
                </div>
                <Calendar className="h-10 w-10 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="shadow-md lg:col-span-2">
            <CardHeader className="flex flex-col gap-2 pb-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Current Courses
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-blue-600">
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course.code}
                  className="flex items-start justify-between gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4 transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900/40"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {course.name}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {course.code}
                      </span>
                    </div>
                    <p className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="h-3 w-3" />
                      {course.nextClass}
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-2 flex-1 rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-2 rounded-full bg-blue-600 transition-all"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                        {course.progress}%
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {course.grade}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Calendar className="h-5 w-5 text-purple-600" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.title}
                  className={`rounded-md border-l-4 p-3 ${event.border} ${event.bg}`}
                >
                  <p className={`text-sm font-medium ${event.text}`}>{event.title}</p>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    {event.time}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Target className="h-5 w-5 text-blue-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {quickActions.map(({ icon: Icon, href, label, className, iconClass }) => {
                  const button = (
                    <Button
                      key={label}
                      variant="outline"
                      className={`flex h-24 w-full flex-col gap-2 ${className}`}
                    >
                      <Icon className={`h-6 w-6 ${iconClass}`} />
                      <span className="text-sm">{label}</span>
                    </Button>
                  );

                  if (href) {
                    return (
                      <Link key={label} href={href}>
                        {button}
                      </Link>
                    );
                  }

                  return button;
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activityFeed.map(({ icon: Icon, text, time, badgeClass }) => (
                <div
                  key={text}
                  className="flex items-start gap-3 border-b border-gray-100 pb-3 last:border-0 dark:border-gray-800"
                >
                  <div className={`rounded-lg p-2 ${badgeClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {text}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className="border-blue-200 bg-gradient-to-r from-blue-50/60 to-purple-50/60 shadow-md dark:border-blue-900/40 dark:from-blue-900/10 dark:to-purple-900/10">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                Academic Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">College</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {profile?.college || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">Degree & Branch</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {degreeBranch}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">Expected Graduation</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {profile?.passing_year || "Not set"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
