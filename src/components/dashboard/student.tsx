import { DashboardProps } from "@/types";

export default function StudentDashboard({ profile }: DashboardProps) {
  return (
    <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Dashboard</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Welcome back, {profile.full_name?.split(' ')[0] || 'Student'}!</p>
        </div>
      </header>
      <div className="p-6 space-y-6">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <div className="text-center">
              <h3 className="font-semibold dark:text-white">Current GPA</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">3.78 / 4.0</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <div className="text-center">
              <h3 className="font-semibold dark:text-white">Credits Earned</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">89 / 120</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <div className="text-center">
              <h3 className="font-semibold dark:text-white">Semester Progress</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">75% Complete</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>College:</strong> {profile.college || 'Not specified'} | 
              <strong> Degree:</strong> {profile.degree || 'Not specified'} | 
              <strong> Branch:</strong> {profile.branch || 'Not specified'} | 
              <strong> Year:</strong> {profile.passing_year || 'Not specified'}
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900">
              <h3 className="font-semibold mb-2 dark:text-white">Today&apos;s Schedule</h3>
              <ul className="space-y-2 text-sm dark:text-gray-300">
                <li>• 9:00 AM - Data Structures (CS301)</li>
                <li>• 11:00 AM - Database Systems (CS401)</li>
                <li>• 2:00 PM - Machine Learning (CS501)</li>
                <li>• 4:00 PM - Study Group - Algorithms</li>
              </ul>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900">
              <h3 className="font-semibold mb-2 dark:text-white">Upcoming Deadlines</h3>
              <ul className="space-y-2 text-sm dark:text-gray-300">
                <li>• Oct 5 - ML Assignment #3</li>
                <li>• Oct 8 - Database Project Phase 2</li>
                <li>• Oct 12 - Data Structures Midterm</li>
                <li>• Oct 15 - Research Paper Draft</li>
              </ul>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900">
              <h3 className="font-semibold mb-2 dark:text-white">Recent Achievements</h3>
              <ul className="space-y-2 text-sm dark:text-gray-300">
                <li>🏆 Dean&apos;s List - Spring 2025</li>
                <li>🥇 Hackathon Winner - TechFest 2025</li>
                <li>📚 Completed Advanced Python Course</li>
                <li>🎯 Perfect Attendance - 4 weeks</li>
              </ul>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900">
              <h3 className="font-semibold mb-2 dark:text-white">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left text-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors dark:text-gray-300">
                  📝 Submit Assignment
                </button>
                <button className="w-full text-left text-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors dark:text-gray-300">
                  📊 Check Grades
                </button>
                <button className="w-full text-left text-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors dark:text-gray-300">
                  💬 Join Study Group
                </button>
                <button className="w-full text-left text-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors dark:text-gray-300">
                  📅 View Full Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
