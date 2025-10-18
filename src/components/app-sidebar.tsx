"use client";

import React, { useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  Home,
  Mail,
  Briefcase,
  Users,
  User,
  Settings,
  LogOut,
  GraduationCap,
  MessageSquare,
  BookmarkIcon,
  TrendingUp,
  PlusCircle,
  Search,
  Bell,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Profile } from "@/types";
import { useSettings } from "@/hooks/use-settings";
import { useDashboardView } from "@/hooks/use-dashboard-view";

interface AppSidebarProps {
  profile: Profile;
}

export function AppSidebar({ profile }: AppSidebarProps) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { openSettings } = useSettings();
  const { setCurrentView } = useDashboardView();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Create role-specific menu items
  const getMenuItems = () => {
    const commonItems = [
      { 
        title: "Dashboard", 
        icon: Home, 
        url: undefined,
        action: () => setCurrentView("overview")
      },
      { title: "Messages", icon: Mail, url: "/messages", action: undefined },
      { title: "Notifications", icon: Bell, url: "/notifications", action: undefined },
    ];

    // Role-specific items
    if (profile.role === 'student') {
      return [
        ...commonItems,
        { title: "Opportunities", icon: Briefcase, url: undefined, action: () => setCurrentView("posts") },
        { title: "Find Mentors", icon: Users, url: "/mentors", action: undefined },
        { title: "My Mentors", icon: GraduationCap, url: "/mentorship", action: undefined },
        { title: "Saved Posts", icon: BookmarkIcon, url: "/saved", action: undefined },
      ];
    }

    if (profile.role === 'alumni') {
      return [
        ...commonItems,
        { title: "My Posts", icon: Briefcase, url: "/posts/my-posts", action: undefined },
        { title: "Create Post", icon: PlusCircle, url: "/posts/create", action: undefined },
        { title: "My Mentees", icon: Users, url: "/mentorship", action: undefined },
        { title: "Analytics", icon: TrendingUp, url: "/analytics", action: undefined },
      ];
    }

    if (profile.role === 'aspirant') {
      return [
        ...commonItems,
        { title: "Explore", icon: Search, url: "/explore", action: undefined },
        { title: "Q&A Forum", icon: MessageSquare, url: "/forum", action: undefined },
        { title: "Connect", icon: Users, url: "/connect", action: undefined },
        { title: "Resources", icon: BookmarkIcon, url: "/resources", action: undefined },
      ];
    }

    // Admin role
    if (profile.role === 'admin') {
      return [
        ...commonItems,
        { title: "Users", icon: Users, url: "/admin/users", action: undefined },
        { title: "Posts", icon: Briefcase, url: "/admin/posts", action: undefined },
        { title: "Reports", icon: MessageSquare, url: "/admin/reports", action: undefined },
        { title: "Analytics", icon: TrendingUp, url: "/admin/analytics", action: undefined },
      ];
    }

    return commonItems;
  };

  const menuItems = getMenuItems();

  // Get section title based on role
  const getSectionTitle = () => {
    switch (profile.role) {
      case 'student':
        return 'Student Portal';
      case 'alumni':
        return 'Alumni Dashboard';
      case 'aspirant':
        return 'Aspirant Hub';
      case 'admin':
        return 'Admin Panel';
      default:
        return 'UniMinder';
    }
  };

  // Mock connections data - replace with actual data from your backend
  const recentConnections = [
    { id: 1, name: "Priya Sharma", role: "Alumni - Google", userId: "user1" },
    { id: 2, name: "Rahul Kumar", role: "Alumni - Microsoft", userId: "user2" },
    { id: 3, name: "Anita Desai", role: "Student - CS", userId: "user3" },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          ${isCollapsed ? 'w-20' : 'w-64'} 
          bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 
          flex flex-col h-full transition-all duration-300
          fixed lg:relative inset-y-0 left-0 z-50
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
      {/* Logo/Brand */}
      <div className="h-20 flex items-center justify-center px-6 border-b border-gray-100 dark:border-gray-800">
        {isCollapsed ? (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">U</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <span className="text-xl font-semibold text-gray-900 dark:text-white">UniMinder</span>
          </div>
        )}
      </div>

      {/* User Profile Section */}
      <div className="px-4 pt-6 pb-2">
        <Link
          href="/profile"
          className={`flex items-center gap-3 px-3 py-3 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900/50 hover:shadow-md transition-all ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? profile.full_name || 'Profile' : ''}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            {user?.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={user.imageUrl} 
                alt={profile.full_name} 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-white" />
            )}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {profile.full_name || user?.fullName || 'User'}
              </p>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 capitalize truncate">
                {profile.role}
                {profile.college && ` • ${profile.college}`}
              </p>
            </div>
          )}
        </Link>
      </div>

      {/* Overview Section */}
      {!isCollapsed && (
        <div className="px-6 pt-6 pb-2">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            {getSectionTitle()}
          </p>
        </div>
      )}

      {/* Menu Items */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          
          // If there's an action (like setting view), render as button
          if (item.action) {
            return (
              <button
                key={item.title}
                onClick={item.action}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group ${
                  isCollapsed ? 'justify-center' : ''
                }`}
                title={isCollapsed ? item.title : ''}
              >
                <Icon className="w-5 h-5" />
                {!isCollapsed && <span className="text-sm font-medium">{item.title}</span>}
              </button>
            );
          }

          // Otherwise render as link
          return (
            <Link
              key={item.title}
              href={item.url || '#'}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group ${
                isCollapsed ? 'justify-center' : ''
              }`}
              title={isCollapsed ? item.title : ''}
            >
              <Icon className="w-5 h-5" />
              {!isCollapsed && <span className="text-sm font-medium">{item.title}</span>}
            </Link>
          );
        })}

        {/* Recent Connections Section */}
        {!isCollapsed && (
          <div className="pt-6">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-3">
              Recent Connections
            </p>
            <div className="space-y-1">
              {recentConnections.map((connection) => (
                <Link
                  key={connection.id}
                  href={`/profile/${connection.userId}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium truncate">{connection.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{connection.role}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Settings Footer */}
      <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-4 space-y-1">
        {!isCollapsed && (
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-3">
            Account
          </p>
        )}
        <button
          onClick={openSettings}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
          {!isCollapsed && <span className="text-sm font-medium">Settings</span>}
        </button>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>

      {/* Desktop Collapse Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex absolute -right-3 top-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1.5 shadow-md hover:shadow-lg transition-all z-50"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        )}
      </button>

      {/* Mobile Close Button */}
      <button
        onClick={() => setIsOpen(false)}
        className="lg:hidden absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg"
      >
        <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      </button>
    </div>
    </>
  );
}