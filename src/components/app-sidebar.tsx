import React from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  Home,
  Briefcase,
  MessageSquare,
  Calendar,
  MessageCircle,
  ChevronDown,
  User,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  Plus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Profile } from "@/types";

interface AppSidebarProps {
  profile: Profile;
}

export function AppSidebar({ profile }: AppSidebarProps) {
  const [isOpen, setIsOpen] = React.useState(true);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();

  // Create role-specific menu items
  const getMenuItems = () => {
    const baseItems = [
      { 
        title: "Overview", 
        icon: Home, 
        url: profile.role === 'student' ? "/dashboard/student" :
             profile.role === 'alumni' ? "/dashboard/alumni" :
             profile.role === 'aspirant' ? "/dashboard/aspirant" :
             "/dashboard"
      },
      { title: "Messages", icon: MessageSquare, url: "/messages" },
      { title: "Calendar", icon: Calendar, url: "/calendar" },
    ];

    if (profile.role === 'student') {
      return [
        ...baseItems,
        { title: "Job Posts", icon: Briefcase, url: "/posts" },
        { title: "Feedback", icon: MessageCircle, url: "/feedback" },
      ];
    } else if (profile.role === 'alumni') {
      return [
        ...baseItems,
        { title: "My Posts", icon: Briefcase, url: "/posts" },
        { title: "Create Post", icon: Plus, url: "/posts/create" },
        { title: "Mentorship", icon: Users, url: "/mentorship" },
      ];
    } else if (profile.role === 'aspirant') {
      return [
        ...baseItems,
        { title: "Resources", icon: Briefcase, url: "/posts" },
        { title: "Guidance", icon: Users, url: "/guidance" },
      ];
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col h-full`}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {isOpen && (
          <div>
            <h2 className="text-xl font-bold text-gray-800">UniMinder</h2>
            <p className="text-xs text-gray-500 capitalize">{profile.role} Dashboard</p>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isOpen ? (
            <PanelLeftClose className="w-5 h-5 text-gray-600" />
          ) : (
            <PanelLeft className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.url}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors group"
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && (
                <span className="text-sm font-medium truncate">
                  {item.title}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Profile Footer */}
      <div className="border-t border-gray-200 p-3">
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
            {isOpen && (
              <>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {profile.full_name || user?.fullName || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {profile.email || user?.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </>
            )}
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && isOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              <Link
                href="/profile"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
              <hr className="border-gray-200" />
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
