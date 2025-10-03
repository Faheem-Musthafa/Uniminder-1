"use client";

import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { Button } from "./ui/button";
import { useAppUser } from "./providers/user-provider";

interface HeroButtonsProps {
  user: ReturnType<typeof useAppUser>["user"];
  isLoaded: boolean;
}

/**
 * Memoized hero buttons component to prevent unnecessary re-renders
 * Displays different CTAs based on authentication state
 */
const HeroButtons = memo(function HeroButtons({ user, isLoaded }: HeroButtonsProps) {
  // Show loading skeleton while checking authentication
  if (!isLoaded) {
    return (
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center md:justify-start gap-3 sm:gap-4" role="status" aria-label="Loading buttons">
        <div className="animate-pulse bg-muted rounded-lg h-12 w-40" />
        <div className="animate-pulse bg-muted rounded-lg h-12 w-36" />
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center md:justify-start gap-3 sm:gap-4">
      {user ? (
        // Authenticated user - show dashboard access
        <>
          <Button size="lg" className="w-full sm:w-auto px-6 py-3 text-base sm:text-lg" asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button size="lg" variant="secondary" className="w-full sm:w-auto px-6 py-3 text-base sm:text-lg" asChild>
            <Link href="#features">Explore Features</Link>
          </Button>
        </>
      ) : (
        // Guest user - show sign up CTA
        <>
          <Button size="lg" className="w-full sm:w-auto px-6 py-3 text-base sm:text-lg" asChild>
            <Link href="/sign-up">Start Connecting</Link>
          </Button>
          <Button size="lg" variant="secondary" className="w-full sm:w-auto px-6 py-3 text-base sm:text-lg" asChild>
            <Link href="#features">Explore Features</Link>
          </Button>
        </>
      )}
    </div>
  );
});

/**
 * Hero section component for the landing page
 * Features responsive layout, dynamic CTAs, and optimized images
 */
export default function Hero() {
  const { user, isLoaded } = useAppUser();

  return (
    <section className="min-h-screen flex flex-1 items-center justify-center px-6 py-12 md:py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900" aria-label="Hero section">
      <div className="w-full max-w-6xl grid gap-8 md:grid-cols-2 items-center">
        {/* Content Section */}
        <div className="text-center md:text-left px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">
            Your University Network, Connected
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mb-8 mx-auto md:mx-0 leading-relaxed">
            UniMinder helps you find mentors, share job referrals, and build
            meaningful connections in your college network. Transform your
            academic journey into career success.
          </p>

          <HeroButtons user={user} isLoaded={isLoaded} />

          {/* Mobile Image */}
          <div className="block md:hidden mt-8">
            <Image
              src="/image/Hero.png"
              alt="Students collaborating and connecting on UniMinder platform"
              width={600}
              height={320}
              className="rounded-xl shadow-2xl object-cover w-full border border-gray-200 dark:border-gray-700"
              priority
              quality={90}
            />
          </div>
        </div>

        {/* Desktop Image */}
        <div className="hidden md:block px-4">
          <Image
            src="/image/Hero.png"
            alt="Students collaborating and connecting on UniMinder platform"
            width={700}
            height={400}
            className="rounded-xl shadow-2xl object-cover w-full hover:scale-105 transition-transform duration-300 border border-gray-200 dark:border-gray-700"
            priority
            quality={90}
          />
        </div>
      </div>
    </section>
  );
}
