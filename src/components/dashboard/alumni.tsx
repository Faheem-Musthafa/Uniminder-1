import { DashboardProps } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, Users, Briefcase, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function AlumniDashboard({ profile }: DashboardProps) {
  return (
    <div className="flex-1 overflow-auto">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Alumni Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Welcome back, {profile.full_name?.split(' ')[0] || 'Alumni'}!</p>
          </div>
          <Button asChild>
            <Link href="/posts/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Post
            </Link>
          </Button>
        </div>
      </header>
      <div className="p-6 space-y-6">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-semibold">Posts Created</h3>
              <p className="text-sm text-gray-500">12 this month</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <h3 className="font-semibold">Students Helped</h3>
              <p className="text-sm text-gray-500">47 connections</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="text-center">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <h3 className="font-semibold">Messages</h3>
              <p className="text-sm text-gray-500">23 unread</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Impact:</strong> Share opportunities, mentor students, and build meaningful connections with the next generation of professionals.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/posts/create">
                    <Briefcase className="mr-2 h-4 w-4" />
                    Share Job Opportunity
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/messages">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Reply to Messages
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/mentorship">
                    <Users className="mr-2 h-4 w-4" />
                    View Mentorship Requests
                  </Link>
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="p-3 border border-gray-200 rounded-lg">
                  <p className="text-sm font-medium">New mentorship request</p>
                  <p className="text-xs text-gray-500">from Rahul Kumar • 2 hours ago</p>
                </div>
                <div className="p-3 border border-gray-200 rounded-lg">
                  <p className="text-sm font-medium">Post got 5 new applications</p>
                  <p className="text-xs text-gray-500">Software Engineer at TechCorp • 4 hours ago</p>
                </div>
                <div className="p-3 border border-gray-200 rounded-lg">
                  <p className="text-sm font-medium">Message from Priya Singh</p>
                  <p className="text-xs text-gray-500">Thanks for the referral! • Yesterday</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}