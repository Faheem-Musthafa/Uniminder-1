import { SignOutButton } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Profile } from "@/types";

interface AlumniDashboardProps {
  profile?: Profile | null;
}

export default function AlumniDashboard({ profile }: AlumniDashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Alumni Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {profile?.full_name}! 👋
            </p>
          </div>
          <SignOutButton>
            <Button variant="outline" size="sm">
              Sign Out
            </Button>
          </SignOutButton>
        </div>

        {/* Profile Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎓 Education
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <strong>College:</strong> {profile?.college || "N/A"}
                </p>
                <p>
                  <strong>Degree:</strong> {profile?.degree || "N/A"}
                </p>
                <p>
                  <strong>Branch:</strong> {profile?.branch || "N/A"}
                </p>
                <p>
                  <strong>Graduated:</strong> {profile?.passing_year || "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                💼 Professional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <strong>Company:</strong> {profile?.company || "N/A"}
                </p>
                <p>
                  <strong>Role:</strong> {profile?.designation || "N/A"}
                </p>
                {profile?.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View LinkedIn →
                  </a>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎯 Mentorship
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Ready to help students and aspirants in your field
                </p>
                <Button size="sm" className="w-full">
                  Start Mentoring
                </Button>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <span className="text-2xl">👥</span>
                <span className="text-sm">Find Mentees</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <span className="text-2xl">📅</span>
                <span className="text-sm">Schedule Sessions</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <span className="text-2xl">💬</span>
                <span className="text-sm">Messages</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <span className="text-2xl">📊</span>
                <span className="text-sm">Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
