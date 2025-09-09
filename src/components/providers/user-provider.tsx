"use client";

import { createContext, useContext, ReactNode } from "react";
import { useUser } from "@clerk/nextjs";

interface UserContextType {
  user: ReturnType<typeof useUser>["user"];
  isLoaded: boolean;
  isSignedIn: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser();
  const isSignedIn = isLoaded && !!user;

  return (
    <UserContext.Provider value={{ user, isLoaded, isSignedIn }}>
      {children}
    </UserContext.Provider>
  );
}

export function useAppUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useAppUser must be used within a UserProvider");
  }
  return context;
}
