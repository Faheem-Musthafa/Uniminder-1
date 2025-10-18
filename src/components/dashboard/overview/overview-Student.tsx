
'use client';

import React, { useState } from 'react';
import { Profile } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, Heart, Bookmark, BookOpen, Users, Clock, Eye, CheckCircle, TrendingUp, ArrowRight } from 'lucide-react';

// UniMinder stats
const uniminderStats = {
  profileViews: 1243,
  mentorsConnected: 5,
  applications: 12,
  savedPosts: 28,
};

const uniminderLearningGoals = [
  { title: 'Complete JavaScript Fundamentals', progress: 65, icon: '📚' },
  { title: 'Build 3 Projects', progress: 33, icon: '🚀' },
  { title: 'Join Mentorship Program', progress: 100, icon: '👥' },
];

const uniminderOpportunities = [
  { id: 1, title: 'Frontend Developer Internship', company: 'TechCorp', type: 'Internship', salary: '800-1200/month' },
  { id: 2, title: 'React Developer', company: 'StartupXYZ', type: 'Full-time', salary: '50k-70k/year' },
  { id: 3, title: 'Web Developer Freelance', company: 'Open', type: 'Freelance', salary: 'Negotiable' },
];

const uniminderMentors = [
  { id: 1, name: 'Sarah Johnson', expertise: 'Frontend Development', avatar: 'SJ' },
  { id: 2, name: 'Alex Chen', expertise: 'Full Stack', avatar: 'AC' },
];

interface OverviewStudentProps {
  profile: Profile;
}

export default function OverviewStudent({ profile }: OverviewStudentProps) {
  const [selectedTab, setSelectedTab] = useState('course');

  // Old stats
  const stats = [
    { label: '2/8 watched', title: 'UI/UX Design', icon: '🎨' },
    { label: '3/8 watched', title: 'Branding', icon: '🎯' },
    { label: '6/12 watched', title: 'Front End', icon: '💻' }
  ];

  const courses = [
    {
      id: 1,
      title: "Beginner's Guide to Becoming a Professional Front-End Developer",
      category: 'FRONT END',
      instructor: 'Leonardo samuel',
      role: 'Mentor',
      image: 'bg-gradient-to-br from-orange-400 to-orange-600'
    },
    {
      id: 2,
      title: 'Optimizing User Experience with the Best UI/UX Design',
      category: 'UI/UX DESIGN',
      instructor: 'Bayu Satto',
      role: 'Mentor',
      image: 'bg-gradient-to-br from-gray-400 to-gray-600'
    },
    {
      id: 3,
      title: 'Reviving and Refresh Company Image',
      category: 'BRANDING',
      instructor: 'Padhang Sario',
      role: 'Mentor',
      image: 'bg-gradient-to-br from-amber-400 to-amber-600'
    }
  ];

  const lessons = [
    { mentor: 'Padhang Sario', date: '2/8/2024', type: 'UI/UX DESIGN', title: 'Understand Of UI/UX Design', action: '→' },
  ];

  const mentors = [
    { name: 'Padhang Sario', role: 'Mentor' },
    { name: 'Zaki Horizontal', role: 'Mentor' },
    { name: 'Leonardo Samsuil', role: 'Mentor' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Coursue Learning Platform Dashboard</h1>
          {/* Profile Card */}
          <div className="bg-white rounded-lg p-6 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                <span className="text-white font-bold">F</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Fireart UI/UX for Fireart Studio</p>
                <p className="text-sm text-gray-500">Available for work</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-6 py-2 border border-gray-200 rounded-full text-gray-700 hover:bg-gray-50 transition">
                Follow
              </button>
              <button className="px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition">
                Get in touch
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="col-span-2 space-y-8">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%27 height=%2760%27 viewBox=%270 0 60 60%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27none%27 fill-rule=%27evenodd%27%3E%3Cg fill=%27%23ffffff%27 fill-opacity=%270.1%27%3E%3Cpath d=%27M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%27/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
              </div>
              <div className="relative z-10">
                <p className="text-sm font-semibold opacity-90 mb-2">ONLINE COURSE</p>
                <h2 className="text-3xl font-bold mb-6 leading-tight">Sharpen Your Skills with Professional Online Courses</h2>
                <button className="bg-gray-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition flex items-center gap-2">
                  Join Now
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition">
                  <p className="text-sm text-gray-500 mb-2">{stat.label}</p>
                  <h3 className="text-lg font-semibold text-gray-900">{stat.title}</h3>
                </div>
              ))}
            </div>
            {/* UniMinder Stats */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              {[
                { label: 'Profile Views', value: uniminderStats.profileViews, icon: Eye, color: 'from-blue-500 to-blue-600' },
                { label: 'Mentors Connected', value: uniminderStats.mentorsConnected, icon: Users, color: 'from-emerald-500 to-emerald-600' },
                { label: 'Applications Sent', value: uniminderStats.applications, icon: CheckCircle, color: 'from-orange-500 to-orange-600' },
                { label: 'Saved Posts', value: uniminderStats.savedPosts, icon: Bookmark, color: 'from-rose-500 to-rose-600' },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Continue Watching */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Continue Watching</h3>
                <button className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold">← →</button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {courses.map((course) => (
                  <div key={course.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition group cursor-pointer">
                    <div className={`h-48 ${course.image} relative`}>
                      <button className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition">
                        <Heart className="w-5 h-5 text-white" />
                      </button>
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-semibold text-indigo-600 mb-2">{course.category}</p>
                      <h4 className="font-semibold text-gray-900 mb-4 line-clamp-2 group-hover:text-indigo-600 transition">{course.title}</h4>
                      <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                          {course.instructor.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{course.instructor}</p>
                          <p className="text-xs text-gray-500">{course.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Goals */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Learning Goals</h3>
              <div className="grid grid-cols-2 gap-4">
                {uniminderLearningGoals.map((goal, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <span>{goal.icon}</span>
                        {goal.title}
                      </span>
                      <span className="text-sm font-semibold text-gray-600">{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Your Lesson */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Your Lesson</h3>
                <button className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold">See all</button>
              </div>
              <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="grid grid-cols-5 px-6 py-3 bg-gray-50 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 uppercase">Mentor</p>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Type</p>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Desc</p>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Action</p>
                </div>
                {lessons.map((lesson, idx) => (
                  <div key={idx} className="grid grid-cols-5 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-xs font-bold">
                        {lesson.mentor.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-900 font-medium">{lesson.mentor}</span>
                    </div>
                    <span className="text-xs text-indigo-600 font-semibold">{lesson.type}</span>
                    <span className="text-sm text-gray-900">{lesson.title}</span>
                    <button className="text-indigo-600 hover:text-indigo-700 font-semibold">{lesson.action}</button>
                  </div>
                ))}
              </div>
            </div>
            {/* UniMinder Opportunities */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Opportunities</h3>
              <div className="space-y-3">
                {uniminderOpportunities.map((opp) => (
                  <div key={opp.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{opp.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{opp.company}</p>
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                            {opp.type}
                          </span>
                          <span className="text-xs text-gray-500">{opp.salary}</span>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 font-semibold">
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Statistic Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">Statistic</h3>
                <button className="text-gray-400 hover:text-gray-600">⋮</button>
              </div>
              <div className="flex justify-center mb-6">
                <div className="relative w-24 h-24">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-300 to-purple-400 flex items-center justify-center">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jason" alt="Avatar" className="w-20 h-20 rounded-full" />
                  </div>
                </div>
              </div>
              <p className="text-center text-gray-900 font-semibold mb-1">Good Morning Jason🔥</p>
              <p className="text-center text-sm text-gray-500 mb-6">Continue your learning to achieve your target!</p>
              {/* Chart Placeholder */}
              <div className="flex items-end justify-center gap-3 h-32 mb-4">
                <div className="w-12 bg-gradient-to-t from-indigo-300 to-indigo-200 rounded-t opacity-50" style={{ height: '60%' }}></div>
                <div className="w-12 bg-gradient-to-t from-purple-400 to-purple-200 rounded-t" style={{ height: '85%' }}></div>
                <div className="w-12 bg-gradient-to-t from-indigo-400 to-indigo-200 rounded-t" style={{ height: '100%' }}></div>
              </div>
              <div className="flex justify-around text-xs text-gray-500">
                <span>1-10 Aug</span>
                <span>11-20 Aug</span>
                <span>21-30 Aug</span>
              </div>
            </div>

            {/* Your Mentor */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Your mentor</h3>
                <button className="text-gray-400 hover:text-gray-600">+</button>
              </div>
              <div className="space-y-3 mb-4">
                {mentors.map((mentor, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                        {mentor.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{mentor.name}</p>
                        <p className="text-xs text-gray-500">{mentor.role}</p>
                      </div>
                    </div>
                    <button className="px-3 py-1 text-indigo-600 border border-indigo-200 rounded-full text-xs font-semibold hover:bg-indigo-50 transition">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
              <button className="w-full py-2 text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition">
                See All
              </button>
            </div>
            {/* UniMinder Mentors */}
            <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-lg p-6 shadow-sm border border-blue-100 mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Recommended Mentors
              </h3>
              <div className="space-y-3">
                {uniminderMentors.map((mentor) => (
                  <div key={mentor.id} className="bg-white rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-semibold text-sm">
                        {mentor.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">{mentor.name}</p>
                        <p className="text-xs text-gray-500">{mentor.expertise}</p>
                      </div>
                    </div>
                    <button className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition">
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}