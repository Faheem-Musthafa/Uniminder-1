"use client";

import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import {
  ArrowUpRight,
  BarChart3,
  Briefcase,
  Calendar,
  Handshake,
  MessageSquare,
  Star,
  Target,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Profile } from "@/types";

interface AlumniDashboardProps {
  profile?: Profile | null;
}

export default function AlumniDashboard({ profile }: AlumniDashboardProps) {
  const initials =
    profile?.full_name
      ?.split(" ")
      .filter(Boolean)
      .map((name) => name[0]?.toUpperCase())
      .join("") || "AL";

  const firstName = profile?.full_name?.split(" ")[0] || "there";

  const mentorshipSessions = [
    {
      mentee: "Ananya Sharma",
      topic: "Resume Review & Interview Prep",
      date: "Today · 5:00 PM IST",
      status: "Scheduled",
    },
    {
      mentee: "Rahul Verma",
      topic: "Career Switch to Product Management",
      date: "Tomorrow · 7:30 PM IST",
      status: "Confirmed",
    },
    {
      mentee: "Isha Patel",
      topic: "MS Application Guidance",
      date: "Friday · 8:00 PM IST",
      status: "Pending",
    },
  ];

  const opportunities = [
    {
      title: "Senior Frontend Engineer · Figma",
      location: "Remote · US Timezones",
      referralCount: 18,
    },
    {
      title: "Product Manager · Unacademy",
      location: "Bengaluru · Hybrid",
      referralCount: 9,
    },
    {
      title: "Data Scientist · Razorpay",
      location: "Bengaluru · Onsite",
      referralCount: 12,
    },
  ];

  const communityUpdates = [
    {
      title: "Mentorship Circle",
      description: "5 new mentees joined your AI/ML mentorship circle this week.",
      icon: Users,
      accent: "bg-blue-100 dark:bg-blue-900/30 text-blue-600",
    },
    {
      title: "Webinar Requests",
      description: "Students are requesting a session on navigating global tech careers.",
      icon: MessageSquare,
      accent: "bg-purple-100 dark:bg-purple-900/30 text-purple-600",
    },
    {
      title: "Success Story",
      description: "Riya cracked her first SDE internship after your mock interview.",
      icon: Star,
      accent: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600",
    },
  ];

  const metrics = [
    {
      label: "Active Mentees",
      value: "14",
      trend: "+3 this month",
      icon: Users,
      gradient: "from-indigo-500 to-indigo-600",
    },
    {
      label: "Sessions Hosted",
      value: "42",
      trend: "+7 this quarter",
      icon: Calendar,
      gradient: "from-sky-500 to-sky-600",
    },
    {
      label: "Referral Hires",
      value: "8",
      trend: "+2 this month",
      icon: Briefcase,
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      label: "Feedback Score",
      value: "4.9",
      trend: "Avg. rating",
      icon: Star,
      gradient: "from-amber-500 to-amber-600",
    },
  ];

  const expertiseSummary = (() => {
    const company = profile?.company?.trim() || "Not specified";
    const title = profile?.designation?.trim() || "Mentor";
    const years =
      typeof profile?.years_of_experience === "number"
        ? `${profile.years_of_experience} yrs experience`
        : "Experience not set";

    return { company, title, years };
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <header className="sticky top-0 z-20 border-b border-indigo-100/60 bg-white/80 backdrop-blur-md dark:border-indigo-900/40 dark:bg-gray-900/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-indigo-600 via-sky-600 to-purple-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
                UniMinder
              </span>
            </Link>
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
              Alumni
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-sm text-white">
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
            Welcome back, {firstName}! ✨
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Empower the next generation with your experience. Here&apos;s what your network
            needs today.
          </p>
        </section>

        <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map(({ label, value, trend, icon: Icon, gradient }) => (
            <Card
              key={label}
              className={`border-0 bg-gradient-to-br ${gradient} text-white shadow-lg`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/70">{label}</p>
                    <p className="text-3xl font-bold">{value}</p>
                    <p className="mt-1 text-xs text-white/70">{trend}</p>
                  </div>
                  <Icon className="h-10 w-10 text-white/70" />
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="shadow-md lg:col-span-2">
            <CardHeader className="flex flex-col gap-2 pb-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Handshake className="h-5 w-5 text-indigo-600" />
                Upcoming Mentorship Sessions
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-indigo-600">
                View Calendar
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {mentorshipSessions.map(({ mentee, topic, date, status }) => (
                <div
                  key={mentee}
                  className="flex flex-col gap-2 rounded-lg border border-indigo-100 bg-white p-4 transition hover:shadow-md dark:border-indigo-900/40 dark:bg-gray-900"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {mentee}
                    </p>
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">
                      {status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{topic}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">{date}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Briefcase className="h-5 w-5 text-emerald-600" />
                Referral Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {opportunities.map(({ title, location, referralCount }) => (
                <div
                  key={title}
                  className="rounded-lg border border-emerald-100 bg-emerald-50/60 p-4 dark:border-emerald-900/40 dark:bg-emerald-900/10"
                >
                  <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                    {title}
                  </p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300/80">
                    {location}
                  </p>
                  <p className="mt-2 text-xs font-medium text-emerald-700 dark:text-emerald-300/80">
                    {referralCount} alumni ready to refer
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
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                Impact Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-indigo-50/70 p-4 dark:bg-indigo-900/20">
                <p className="text-sm font-semibold text-indigo-800 dark:text-indigo-200">
                  Mentorship hours
                </p>
                <p className="mt-2 text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                  126 hrs
                </p>
                <p className="text-xs text-indigo-700 dark:text-indigo-300/80">
                  +18 hours compared to last quarter
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-indigo-100 p-3 dark:border-indigo-900/40">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Success stories</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">11</p>
                  <p className="text-[11px] text-indigo-600 dark:text-indigo-300">
                    Students placed in top firms
                  </p>
                </div>
                <div className="rounded-lg border border-indigo-100 p-3 dark:border-indigo-900/40">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Endorsements</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">36</p>
                  <p className="text-[11px] text-indigo-600 dark:text-indigo-300">
                    LinkedIn shout-outs this year
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <MessageSquare className="h-5 w-5 text-purple-600" />
                Community Updates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {communityUpdates.map(({ title, description, icon: Icon, accent }) => (
                <div key={title} className="flex gap-3">
                  <div className={`rounded-lg p-2 ${accent}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50/60 to-sky-50/60 shadow-md dark:border-indigo-900/40 dark:from-indigo-900/10 dark:to-sky-900/10">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Target className="h-5 w-5 text-indigo-600" />
                Mentor Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">Current Role</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {expertiseSummary.title}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">Company</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {expertiseSummary.company}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">Experience</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {expertiseSummary.years}
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
