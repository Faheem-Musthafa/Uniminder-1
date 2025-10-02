import { DashboardProps } from "@/types";
import { Button } from "@/components/ui/button";
import { BookOpen, Target, Users, Calendar, TrendingUp, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function AspirantDashboard({ profile }: DashboardProps) {
  return (
    <div className="flex-1 overflow-auto">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Aspirant Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Welcome, {profile.full_name?.split(' ')[0] || 'Aspirant'}!</p>
        </div>
      </header>

      <div className="p-6 space-y-6">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="text-center">
              <Target className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <h3 className="font-semibold">Goals Set</h3>
              <p className="text-sm text-gray-500">5 active goals</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-semibold">Courses Completed</h3>
              <p className="text-sm text-gray-500">12 certificates</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <h3 className="font-semibold">Connections</h3>
              <p className="text-sm text-gray-500">28 mentors</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Journey:</strong> Explore opportunities, connect with mentors, and build your path to success through continuous learning and networking.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-4">Learning Path</h3>
              <div className="space-y-3">
                <div className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Full Stack Development</p>
                      <p className="text-xs text-gray-500">Progress: 75%</p>
                    </div>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full w-3/4"></div>
                    </div>
                  </div>
                </div>
                <div className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Data Science</p>
                      <p className="text-xs text-gray-500">Progress: 45%</p>
                    </div>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '45%'}}></div>
                    </div>
                  </div>
                </div>
                <div className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Digital Marketing</p>
                      <p className="text-xs text-gray-500">Progress: 20%</p>
                    </div>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{width: '20%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/posts">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Browse Opportunities
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/guidance">
                    <Users className="mr-2 h-4 w-4" />
                    Find Mentors
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/messages">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Check Messages
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/calendar">
                    <Calendar className="mr-2 h-4 w-4" />
                    View Schedule
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold mb-2">Upcoming Events</h3>
              <ul className="space-y-2 text-sm">
                <li>• Oct 10 - Career Fair 2025</li>
                <li>• Oct 15 - Web Development Workshop</li>
                <li>• Oct 20 - Networking Meet & Greet</li>
                <li>• Oct 25 - Industry Panel Discussion</li>
              </ul>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold mb-2">Recent Activity</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span>Completed React.js basics</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>Connected with 3 new mentors</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-orange-500" />
                  <span>Set new learning goal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}