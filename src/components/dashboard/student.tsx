import { SignOutButton } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Profile } from "@/types";
import { GraduationCap, BookOpen, Users, Calendar, MessageSquare, Trophy, Clock, Target } from "lucide-react";

interface StudentDashboardProps {
  profile?: Profile | null;
}

export default function StudentDashboard({ profile }: StudentDashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Student Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {profile?.full_name}! Ready to learn? 📚
            </p>
          </div>
          <SignOutButton>
            <Button variant="outline" size="sm">
              Sign Out
            </Button>
          </SignOutButton>
        </div>

        {/* Academic Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                Academic Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm"><strong>College:</strong></p>
                <p className="text-sm text-gray-600">{profile?.college || 'Not specified'}</p>
                <p className="text-sm"><strong>Degree:</strong></p>
                <p className="text-sm text-gray-600">{profile?.degree || 'Not specified'}</p>
                <p className="text-sm"><strong>Branch:</strong></p>
                <p className="text-sm text-gray-600">{profile?.branch || 'Not specified'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                Academic Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">8.2</div>
                  <p className="text-sm text-gray-600">Current CGPA</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600">85%</div>
                  <p className="text-xs text-gray-600">Attendance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm"><strong>Expected Graduation:</strong></p>
                <p className="text-lg font-semibold text-purple-600">
                  {profile?.passing_year || 'Not set'}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <p className="text-xs text-gray-600">60% Complete</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Connections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">5</div>
                  <p className="text-sm text-gray-600">Mentors</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-600">23</div>
                  <p className="text-xs text-gray-600">Study Group</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Current Courses */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Current Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Data Structures & Algorithms', progress: 75, grade: 'A-' },
                  { name: 'Database Management Systems', progress: 60, grade: 'B+' },
                  { name: 'Software Engineering', progress: 85, grade: 'A' },
                  { name: 'Computer Networks', progress: 45, grade: 'B' },
                ].map((course, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{course.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{course.progress}%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-green-600">{course.grade}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border-l-4 border-red-500 bg-red-50">
                  <p className="font-medium text-sm">Database Exam</p>
                  <p className="text-xs text-gray-600">Tomorrow, 10:00 AM</p>
                </div>
                <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                  <p className="font-medium text-sm">Project Submission</p>
                  <p className="text-xs text-gray-600">Friday, 11:59 PM</p>
                </div>
                <div className="p-3 border-l-4 border-green-500 bg-green-50">
                  <p className="font-medium text-sm">Career Fair</p>
                  <p className="text-xs text-gray-600">Next Monday</p>
                </div>
                <div className="p-3 border-l-4 border-purple-500 bg-purple-50">
                  <p className="font-medium text-sm">Mentor Session</p>
                  <p className="text-xs text-gray-600">Wednesday, 3:00 PM</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <BookOpen className="h-6 w-6" />
                <span className="text-sm">Study Materials</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Users className="h-6 w-6" />
                <span className="text-sm">Find Study Group</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <MessageSquare className="h-6 w-6" />
                <span className="text-sm">Messages</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Target className="h-6 w-6" />
                <span className="text-sm">Career Guidance</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Calendar className="h-6 w-6" />
                <span className="text-sm">Schedule</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Trophy className="h-6 w-6" />
                <span className="text-sm">Achievements</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
