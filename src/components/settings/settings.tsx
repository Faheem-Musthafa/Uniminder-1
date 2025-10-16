"use client";

import React, { useState } from 'react';
import { User, Shield, Bell, Palette, X, Loader2, Save } from 'lucide-react';
import { Profile } from '@/types';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useSettings } from '@/hooks/use-settings';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SettingsModalProps {
  profile: Profile;
}

export default function SettingsModal({ profile }: SettingsModalProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { isOpen, closeSettings } = useSettings();
  const [activeTab, setActiveTab] = useState('General');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    full_name: profile.full_name || '',
    email: profile.email || '',
    bio: profile.bio || '',
    location: profile.location || '',
    linkedin: profile.linkedin || '',
    
    // Notifications
    email_notifications: true,
    push_notifications: true,
    
    // Privacy
    profile_public: true,
    show_email: false,
  });

  if (!isOpen) return null;

  const tabs = [
    { id: 'General', icon: User, label: 'Profile' },
    { id: 'Appearance', icon: Palette, label: 'Appearance' },
    { id: 'Notifications', icon: Bell, label: 'Notifications' },
    { id: 'Privacy', icon: Shield, label: 'Privacy' }
  ];

  const toggleSetting = (key: keyof typeof settings) => {
    if (typeof settings[key] === 'boolean') {
      setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/settings/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'General':
        return (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Profile</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={settings.full_name}
                onChange={(e) => setSettings(prev => ({ ...prev, full_name: e.target.value }))}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={settings.email}
                readOnly
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                value={settings.bio}
                onChange={(e) => setSettings(prev => ({ ...prev, bio: e.target.value }))}
                rows={3}
                maxLength={300}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="Tell us about yourself..."
              />
              <p className="text-xs text-gray-500 mt-1">{settings.bio.length}/300 characters</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={settings.location}
                  onChange={(e) => setSettings(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="City, Country"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={settings.linkedin}
                  onChange={(e) => setSettings(prev => ({ ...prev, linkedin: e.target.value }))}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="linkedin.com/in/..."
                />
              </div>
            </div>
          </div>
        );

      case 'Appearance':
        return (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Appearance</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Theme
              </label>
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border-2 transition-all ${
                    theme === 'light'
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  ☀️ Light
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border-2 transition-all ${
                    theme === 'dark'
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  🌙 Dark
                </button>
              </div>
            </div>
          </div>
        );

      case 'Notifications':
        return (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Notifications</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <span className="text-sm sm:text-base text-gray-900 dark:text-white font-medium block">Email notifications</span>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Receive updates via email</p>
                </div>
                <button
                  onClick={() => toggleSetting('email_notifications')}
                  className={`relative w-11 sm:w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                    settings.email_notifications ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.email_notifications ? 'translate-x-5 sm:translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <span className="text-sm sm:text-base text-gray-900 dark:text-white font-medium block">Push notifications</span>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Get instant notifications</p>
                </div>
                <button
                  onClick={() => toggleSetting('push_notifications')}
                  className={`relative w-11 sm:w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                    settings.push_notifications ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.push_notifications ? 'translate-x-5 sm:translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        );

      case 'Privacy':
        return (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Privacy</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <span className="text-sm sm:text-base text-gray-900 dark:text-white font-medium block">Public profile</span>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Make your profile visible to everyone</p>
                </div>
                <button
                  onClick={() => toggleSetting('profile_public')}
                  className={`relative w-11 sm:w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                    settings.profile_public ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.profile_public ? 'translate-x-5 sm:translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <span className="text-sm sm:text-base text-gray-900 dark:text-white font-medium block">Show email</span>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Display your email on your profile</p>
                </div>
                <button
                  onClick={() => toggleSetting('show_email')}
                  className={`relative w-11 sm:w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                    settings.show_email ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.show_email ? 'translate-x-5 sm:translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      onClick={closeSettings}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 animate-in fade-in duration-200"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 max-h-[95vh]"
      >
        <div className="flex flex-col md:flex-row h-full md:h-[600px]">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 sm:p-6 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Settings</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Manage your preferences</p>
            </div>

            {/* Mobile: Horizontal scroll tabs */}
            <div className="md:hidden flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
                      isActive 
                        ? 'bg-white dark:bg-gray-800 shadow-md text-gray-900 dark:text-white' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Desktop: Vertical tabs with scroll */}
            <ScrollArea className="hidden md:block h-[500px] pr-4">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive 
                          ? 'bg-white dark:bg-gray-800 shadow-md text-gray-900 dark:text-white' 
                          : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-4 sm:p-6 md:p-8">
            <ScrollArea className="h-[calc(95vh-180px)] md:h-[536px]">
              <div className="max-w-2xl mx-auto pr-2 sm:pr-4">
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
                  {renderContent()}

                  {/* Messages */}
                  {error && (
                    <div className="mt-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="mt-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                      Settings saved successfully!
                    </div>
                  )}

                  {/* Save Button */}
                  <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                    <button
                      onClick={closeSettings}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Close Button */}
          <button
            onClick={closeSettings}
            className="absolute top-3 right-3 sm:top-6 sm:right-6 p-1.5 sm:p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-lg z-10"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}