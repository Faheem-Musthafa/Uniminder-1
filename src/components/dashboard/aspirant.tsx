import { SignOutButton } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Profile } from "@/types";
import {
  BookOpen,
  Target,
  Users,
  Calendar,
  MessageSquare,
  TrendingUp,
} from "lucide-react";

interface AspirantsDashboardProps {
  profile?: Profile | null;
}

export default function AspirantsDashboard({
  profile,
}: AspirantsDashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Aspirant Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome, {profile?.full_name}! Let&apos;s achieve your goals 🎯
            </p>
          </div>
          <SignOutButton>
            <Button variant="outline" size="sm">
              Sign Out
            </Button>
          </SignOutButton>
        </div>

        {/* Goals Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Target Exam
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-blue-600">
                  {profile?.entrance_exam || "Not Set"}
                </p>
                {profile?.target_college && (
                  <p className="text-sm text-gray-600">
                    <strong>Dream College:</strong> {profile.target_college}
                  </p>
                )}
                <Button size="sm" variant="outline" className="w-full">
                  Update Goal
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">75%</div>
                  <p className="text-sm text-gray-600">Study Goal Complete</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Mentors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-purple-600">3</p>
                <p className="text-sm text-gray-600">Active connections</p>
                <Button size="sm" className="w-full">
                  Find More Mentors
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Study Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-24 flex flex-col gap-2">
                  <BookOpen className="h-6 w-6" />
                  <span className="text-sm">Study Materials</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col gap-2">
                  <Target className="h-6 w-6" />
                  <span className="text-sm">Mock Tests</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col gap-2">
                  <TrendingUp className="h-6 w-6" />
                  <span className="text-sm">Progress Tracker</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col gap-2">
                  <Calendar className="h-6 w-6" />
                  <span className="text-sm">Study Schedule</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mentorship</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Next Session</p>
                    <p className="text-sm text-gray-600">
                      Math Prep - Tomorrow 2PM
                    </p>
                  </div>
                  <Button size="sm">Join</Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="flex flex-col gap-2 h-20"
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span className="text-sm">Messages</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex flex-col gap-2 h-20"
                  >
                    <Users className="h-5 w-5" />
                    <span className="text-sm">Find Mentors</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 border-l-4 border-blue-500 bg-blue-50">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Completed Math Chapter 5</p>
                  <p className="text-sm text-gray-600">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border-l-4 border-green-500 bg-green-50">
                <Target className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Mock Test Score: 85%</p>
                  <p className="text-sm text-gray-600">Yesterday</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border-l-4 border-purple-500 bg-purple-50">
                <Users className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium">Mentoring session with John</p>
                  <p className="text-sm text-gray-600">3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
