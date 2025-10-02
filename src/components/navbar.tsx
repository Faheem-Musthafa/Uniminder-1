"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignOutButton, useUser } from "@clerk/nextjs";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const { user, isLoaded } = useUser();

  return (
    <header className="w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
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
        </nav>

        {/* Desktop auth buttons */}
        <div className="hidden md:flex items-center gap-4">
          {!isLoaded ? (
            <>
              <div className="animate-pulse bg-gray-200 rounded h-8 w-16"></div>
              <div className="animate-pulse bg-gray-200 rounded h-8 w-20"></div>
            </>
          ) : user ? (
            <>
              <span className="text-sm text-gray-600">
                Welcome, {user.firstName || "User"}!
              </span>
              <Link href="/dashboard">
                <Button variant="default">Dashboard</Button>
              </Link>
              <SignOutButton>
                <Button variant="outline" size="sm">
                  Sign Out
                </Button>
              </SignOutButton>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="secondary">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
        >
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
        </button>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-3 bg-white border-t">
          <Link href="#about" className="block text-base font-medium py-2">
            About
          </Link>
          <Link href="#features" className="block text-base font-medium py-2">
            Features
          </Link>
          <Link href="#faqs" className="block text-base font-medium py-2">
            FAQs
          </Link>

          <div className="flex flex-col gap-2 pt-2">
            {!isLoaded ? (
              <>
                <div className="animate-pulse bg-gray-200 rounded h-8 w-full"></div>
                <div className="animate-pulse bg-gray-200 rounded h-8 w-full"></div>
              </>
            ) : user ? (
              <>
                <p className="text-sm text-gray-600 px-2">Welcome back!</p>
                <Link href="/dashboard">
                  <Button variant="default" className="w-full">
                    Dashboard
                  </Button>
                </Link>
                <SignOutButton>
                  <Button variant="outline" size="sm" className="w-full">
                    Sign Out
                  </Button>
                </SignOutButton>
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="secondary" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
