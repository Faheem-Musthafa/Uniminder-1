"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="text-2xl font-bold">
          UniMinder
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-4">
          <Link href="/about">
            <Button variant="link">About</Button>
          </Link>
          <Link href="/features">
            <Button variant="link">Features</Button>
          </Link>
          <Link href="/faqs">
            <Button variant="link">FAQs</Button>
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/sign-in">
            <Button variant="secondary">Sign In</Button>
          </Link>
          <Link href="/sign-up">
            <Button>Get Started</Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen((s) => !s)}
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
        <div className="md:hidden px-4 pb-4 space-y-3">
          <Link href="/about" className="block text-base font-medium">
            About
          </Link>
          <Link href="/features" className="block text-base font-medium">
            Features
          </Link>
          <Link href="/faqs" className="block text-base font-medium">
            FAQs
          </Link>

          <div className="flex flex-col gap-2 pt-2">
            <Link href="/sign-in">
              <Button variant="secondary" className="w-full">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="w-full">Get Started</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
