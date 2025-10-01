"use client";

import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import {
  AlarmClock,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Compass,
  Flame,
  ListTodo,
  MessageSquare,
  Target,
  Trophy,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Profile } from "@/types";

interface AspirantDashboardProps {
  profile?: Profile | null;
}

export default function AspirantDashboard({ profile }: AspirantDashboardProps) {
  const initials =
    profile?.full_name
      ?.split(" ")
      .filter(Boolean)
      .map((name) => name[0]?.toUpperCase())
      .join("") || "AS";

  const firstName = profile?.full_name?.split(" ")[0] || "there";

  const studyRoadmap = [
    {
      title: "Mock Test • Quantitative Aptitude",
      description: "Focus on time, speed & distance. Review mistakes from last mock.",
      due: "Today · 7:00 PM",
      status: "In Progress",
    },
    {
      title: "Revision • Data Interpretation",
      description: "Complete sets from CAT 2023 paper. Target 90% accuracy.",
      due: "Tomorrow · 6:30 PM",
      status: "Scheduled",
    },
    {
      title: "Mentor Call • Strategy Deep Dive",
      description: "Discuss weak sections and personalised study plan for October.",
      due: "Friday · 8:00 PM",
      status: "Upcoming",
    },
  ];

  const weeklyTargets = [
    { label: "Practice Hours", value: 18, goal: 20 },
    { label: "Mock Tests", value: 3, goal: 4 },
    { label: "Mentor Sessions", value: 1, goal: 2 },
    { label: "Habit Streak", value: 9, goal: 7 },
  ];

  const motivationFeed = [
    {
      icon: Trophy,
      title: "Great job on the last mock!",
      description: "You improved by 48 points compared to last week.",
      accent: "bg-blue-100 dark:bg-blue-900/30 text-blue-600",
    },
    {
      icon: CheckCircle2,
      title: "Daily streak unlocked",
      description: "You&apos;ve stayed consistent for 9 days straight.",
      accent: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600",
    },
    {
      icon: Flame,
      title: "Momentum building",
      description: "Mentor Aarav says your RC approach is now spot on!",
      accent: "bg-orange-100 dark:bg-orange-900/30 text-orange-600",
    },
  ];

  const quickLinks = [
    {
      label: "Ask Doubts",
      icon: MessageSquare,
      description: "Get guidance from mentors"
    },
    {
      label: "Study Planner",
      icon: ListTodo,
      description: "Customise your daily flow"
    },
    {
      label: "Mock Analysis",
      icon: Award,
      description: "Deep-dive into past attempts"
    },
    {
      label: "Exam Resources",
      icon: BookOpen,
      description: "Curated practice material"
    },
  ];

  const targetExam = profile?.entrance_exam || "Your target exam";
  const dreamCollege = profile?.target_college || "the dream campus";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <header className="sticky top-0 z-20 border-b border-purple-100/60 bg-white/80 backdrop-blur-md dark:border-purple-900/40 dark:bg-gray-900/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
                UniMinder
              </span>
            </Link>
            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
              Aspirant
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-sm text-white">
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
            Let&apos;s get you closer to {dreamCollege}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {firstName}, stay focused—{targetExam} is {""}
            <span className="font-medium text-purple-600 dark:text-purple-300">72 days away</span>.
          </p>
        </section>

        <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {weeklyTargets.map(({ label, value, goal }) => {
            const progress = Math.min(100, Math.round((value / goal) * 100));
            const isAchieved = value >= goal;

            return (
              <Card
                key={label}
                className="border-0 bg-white text-gray-900 shadow-lg dark:bg-gray-900 dark:text-white"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
                      <p className="text-3xl font-bold">
                        {value}
                        <span className="text-base font-semibold text-gray-400 dark:text-gray-500">/{goal}</span>
                      </p>
                    </div>
                    {isAchieved ? (
                      <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                    ) : (
                      <Target className="h-8 w-8 text-purple-500" />
                    )}
                  </div>
                  <div className="mt-4 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {isAchieved ? "Goal achieved—amazing consistency!" : "Keep going, you&apos;re almost there."}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="shadow-md lg:col-span-2">
            <CardHeader className="flex flex-col gap-2 pb-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Compass className="h-5 w-5 text-purple-600" />
                Study Roadmap
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-purple-600">
                View Planner
                <Calendar className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {studyRoadmap.map(({ title, description, due, status }) => (
                <div
                  key={title}
                  className="flex flex-col gap-2 rounded-lg border border-purple-100 bg-white p-4 transition hover:shadow-md dark:border-purple-900/40 dark:bg-gray-900"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {title}
                    </p>
                    <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-600 dark:bg-purple-900/30 dark:text-purple-300">
                      {status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">{due}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <AlarmClock className="h-5 w-5 text-orange-500" />
                Daily Discipline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-orange-50/70 p-4 dark:bg-orange-900/20">
                <p className="text-sm font-semibold text-orange-800 dark:text-orange-200">
                  Morning Sprint completed
                </p>
                <p className="text-xs text-orange-700 dark:text-orange-300/80">
                  You studied Quant for 2.5 hrs today. Keep this rhythm!
                </p>
              </div>
              <div className="rounded-lg border border-purple-100 p-4 dark:border-purple-900/40">
                <p className="text-xs text-gray-500 dark:text-gray-400">Focus theme</p>
                <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                  Reading comprehension drills
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-300">
                  Mentor Aarav expects 85% accuracy in next mock
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <MessageSquare className="h-5 w-5 text-purple-600" />
                Tap into mentors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-purple-100 p-4 dark:border-purple-900/40">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Live doubt-solving room
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  23 learners online · Mentor Priya hosting for Verbal Ability
                </p>
              </div>
              <div className="rounded-lg border border-purple-100 p-4 dark:border-purple-900/40">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Upcoming mentor match
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Aarav Jain (IIM A) suggested for weekly accountability calls
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Trophy className="h-5 w-5 text-pink-500" />
                Motivation Feed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {motivationFeed.map(({ icon: Icon, title, description, accent }) => (
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
          <Card className="border-purple-200 bg-gradient-to-r from-purple-50/60 to-pink-50/60 shadow-md dark:border-purple-900/40 dark:from-purple-900/10 dark:to-pink-900/10">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <ListTodo className="h-5 w-5 text-purple-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {quickLinks.map(({ icon: Icon, label, description }) => (
                <Card key={label} className="border border-purple-100 dark:border-purple-900/40">
                  <CardContent className="flex items-start gap-3 p-4">
                    <div className="rounded-lg bg-purple-50 p-2 dark:bg-purple-900/30">
                      <Icon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {label}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
