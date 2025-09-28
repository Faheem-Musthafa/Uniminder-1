"use client";

import MultiStepForm from "@/components/onboarding/multi-step-form";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
          {/* Left: Brand / Highlights */}
          <div className="lg:col-span-2 hidden lg:flex">
            <div className="relative w-full rounded-2xl bg-white/70 dark:bg-gray-900/50 backdrop-blur border border-gray-200 dark:border-gray-800 p-8 shadow-sm overflow-hidden">
              <div className="absolute -top-24 -right-24 h-64 w-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 h-64 w-64 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />

              <div className="relative">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Welcome to UniMinder
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  A community to guide your academic and career journey.
                </p>

                <ul className="mt-6 space-y-4">
                  {[
                    {
                      title: "Personalized Dashboards",
                      desc: "Student, Alumni, or Aspirant — we tailor your experience.",
                    },
                    {
                      title: "Networking & Mentorship",
                      desc: "Connect with peers, alumni, and mentors in your field.",
                    },
                    {
                      title: "Goal Tracking",
                      desc: "Stay on top of exams, internships, and career milestones.",
                    },
                  ].map((item) => (
                    <li key={item.title} className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 text-xs font-bold">
                        ✓
                      </span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {item.title}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3 flex items-center">
            <div className="w-full">
              <MultiStepForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
