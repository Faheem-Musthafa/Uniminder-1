import React from "react";
import {
  Home,
  Inbox,
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
} from "lucide-react";
import { ModeToggle } from "./DrakModeToggle";

const Sidebar = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  const menuItems = [
    { title: "Home", icon: Home, url: "#home" },
    { title: "Inbox", icon: Inbox, url: "#inbox" },
    { title: "Job Posts", icon: Briefcase, url: "#jobs" },
    { title: "Messages", icon: MessageSquare, url: "#messages" },
    { title: "Calendar", icon: Calendar, url: "#calendar" },
    { title: "FeedBack", icon: MessageCircle, url: "#feedback" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-64" : "w-20"
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {isOpen && (
            <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
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
              <a
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
              </a>
            );
            <ModeToggle />;
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
                      John Doe
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      john@example.com
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
                <a
                  href="#account"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Account</span>
                </a>
                <a
                  href="#settings"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </a>
                <hr className="border-gray-200" />
                <a
                  href="#logout"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Your Dashboard
          </h1>
          <p className="text-gray-600">
            Click the toggle button to collapse/expand the sidebar. The sidebar
            includes all your requested menu items and a profile section at the
            bottom with a dropdown menu.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
