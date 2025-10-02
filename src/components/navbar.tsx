"use client";

import { useState, useCallback, memo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@clerk/nextjs";
import { ModeToggle } from "./DrakModeToggle";
import { useAppUser } from "./providers/user-provider";

// Memoize the hamburger icon to prevent unnecessary re-renders
const HamburgerIcon = memo(function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      {open ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 6h16M4 12h16M4 18h16"
        />
      )}
    </svg>
  );
});

// Memoize auth buttons to prevent re-renders
const AuthButtons = memo(function AuthButtons({
  user,
  isLoaded,
  isMobile,
}: {
  user: ReturnType<typeof useAppUser>["user"];
  isLoaded: boolean;
  isMobile?: boolean;
}) {
  if (!isLoaded) {
    return (
      <div
        className={`flex ${
          isMobile ? "flex-col w-full" : ""
        } items-center gap-2`}
      >
        <div className="animate-pulse bg-muted rounded h-8 w-16"></div>
        <div className="animate-pulse bg-muted rounded h-8 w-20"></div>
      </div>
    );
  }

  const baseClasses = isMobile ? "w-full" : "";
  const containerClasses = isMobile
    ? "flex flex-col gap-2 pt-2"
    : "flex items-center gap-4";

  return (
    <div className={containerClasses}>
      {user ? (
        // Signed in user
        <>
          {isMobile && (
            <p className="text-sm text-muted-foreground px-2">
              Welcome back
            </p>
          )}
          {!isMobile && (
            <span className="text-sm text-muted-foreground">
              Welcome,{" "}
              {user.firstName || user.emailAddresses?.[0]?.emailAddress}!
            </span>
          )}
          <Link href="/dashboard">
            <Button variant="default" className={baseClasses}>
              Dashboard
            </Button>
          </Link>
          <SignOutButton>
            <Button variant="outline" size="sm" className={baseClasses}>
              Sign Out
            </Button>
          </SignOutButton>
        </>
      ) : (
        // Not signed in
        <>
          <Link href="/sign-in">
            <Button variant="secondary" className={baseClasses}>
              Sign In
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className={baseClasses}>Get Started</Button>
          </Link>
        </>
      )}
    </div>
  );
});

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const { user, isLoaded } = useAppUser();

  const toggleMenu = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  return (
    <header className="w-full">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="text-2xl font-bold">
          UniMinder
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-4">
          <Link href="#about">
            <Button variant="link">About</Button>
          </Link>
          <Link href="#features">
            <Button variant="link">Features</Button>
          </Link>
          <Link href="#faqs">
            <Button variant="link">FAQs</Button>
          </Link>
          <ModeToggle />
        </nav>

        {/* Desktop auth buttons */}
        <div className="hidden md:flex">
          <AuthButtons user={user} isLoaded={isLoaded} />
        </div>

        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          aria-label="Toggle menu"
          className="md:hidden p-2 rounded-md hover:bg-muted"
        >
          <HamburgerIcon open={open} />
        </button>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-3">
          <Link href="#about" className="block text-base font-medium">
            About
          </Link>
          <Link href="#features" className="block text-base font-medium">
            Features
          </Link>
          <Link href="#faqs" className="block text-base font-medium">
            FAQs
          </Link>

          {/* Mobile auth buttons */}
          <AuthButtons user={user} isLoaded={isLoaded} isMobile />
        </div>
      )}
    </header>
  );
}
