"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function Hero() {
  const { user, isLoaded } = useUser();

  return (
    <main className=" min-h-screen flex flex-1 items-center justify-center px-6">
      <div className="w-full max-w-6xl grid gap-8 md:grid-cols-2 items-center">
        <div className="text-center md:text-left px-4">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight mb-3">
            Your University Network, Connected
          </h2>
          <p className="text-base sm:text-lg md:text-2xl text-gray-500 max-w-2xl mb-6 mx-auto md:mx-0">
            UniMinder helps you find mentors, share job referrals, and build
            meaningful connections in your college network. Transform your
            academic journey into career success.
          </p>

          {/* Buttons: stacked on mobile, inline on sm+ */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center md:justify-start gap-3 sm:gap-4">
            {isLoaded && user ? (
              // Signed in user - show dashboard button
              <>
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto px-6 py-3 text-base sm:text-lg"
                  >
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href="#features" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto px-6 py-3 text-base sm:text-lg"
                    variant={"secondary"}
                  >
                    Explore Features
                  </Button>
                </Link>
              </>
            ) : (
              // Not signed in - show sign up buttons
              <>
                <Link href="/sign-up" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto px-6 py-3 text-base sm:text-lg"
                  >
                    Start Connecting
                  </Button>
                </Link>
                <Link href="#features" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto px-6 py-3 text-base sm:text-lg"
                    variant={"secondary"}
                  >
                    Explore Features
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Small-screen image (below text) */}
          <div className="block md:hidden mt-6">
            <Image
              src="/image/Hero.png"
              alt="Students connecting"
              width={600}
              height={320}
              className="rounded-lg shadow-lg object-cover w-full"
            />
          </div>
        </div>

        {/* Right-side image for md+ */}
        <div className="hidden md:block px-4">
          <Image
            src="/image/Hero.png"
            alt="Students connecting"
            width={700}
            height={400}
            className="mt-10 rounded-lg shadow-lg object-cover w-full"
          />
        </div>
      </div>
    </main>
  );
}
