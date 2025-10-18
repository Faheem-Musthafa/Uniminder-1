"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type DashboardView = "overview" | "posts" | "mentors" | "mentorship" | "saved";

interface DashboardContextType {
  currentView: DashboardView;
  setCurrentView: (view: DashboardView) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<DashboardView>("overview");

  return (
    <DashboardContext.Provider value={{ currentView, setCurrentView }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardView() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboardView must be used within DashboardProvider");
  }
  return context;
}

// Optional variant for components that can operate without the provider.
// Returns undefined when not inside a DashboardProvider.
export function useDashboardViewOptional() {
  return useContext(DashboardContext);
}
