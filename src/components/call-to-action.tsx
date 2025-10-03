"use client";

import { Button } from "@/components/ui/button";
import { Mail, SendHorizonal } from "lucide-react";
import { useAppUser } from "./providers/user-provider";
import Link from "next/link";
import { memo } from "react";

const CTAContent = memo(function CTAContent({
  user,
  isLoaded,
}: {
  user: ReturnType<typeof useAppUser>["user"];
  isLoaded: boolean;
}) {
  if (!isLoaded) {
    return (
      <div className="text-center">
        <div className="animate-pulse bg-gray-200 rounded h-8 w-48 mx-auto mb-4"></div>
        <div className="animate-pulse bg-gray-200 rounded h-4 w-64 mx-auto mb-8"></div>
        <div className="animate-pulse bg-gray-200 rounded h-12 w-32 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="text-center">
      {user ? (
        // Signed in user
        <>
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            Ready to Connect?
          </h2>
          <p className="mt-4">
            Your profile is set up! Start building your network and find
            mentors.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Learn More
              </Button>
            </Link>
          </div>
        </>
      ) : (
        // Not signed in
        <>
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            Support
          </h2>
          <p className="mt-4">
            Any questions or feedback? We&apos;re here to help!
          </p>

          <form action="" className="mx-auto mt-10 max-w-sm lg:mt-12">
            <div className="bg-background has-[input:focus]:ring-muted relative grid grid-cols-[1fr_auto] items-center rounded-[calc(var(--radius)+0.75rem)] border pr-3 shadow shadow-zinc-950/5 has-[input:focus]:ring-2">
              <Mail className="text-caption pointer-events-none absolute inset-y-0 left-5 my-auto size-5" />

              <input
                placeholder="Your mail address"
                className="h-14 w-full bg-transparent pl-12 focus:outline-none"
                type="email"
              />

              <div className="md:pr-1.5 lg:pr-0">
                <Button aria-label="submit" className="rounded-(--radius)">
                  <span className="hidden md:block">Get Started</span>
                  <SendHorizonal
                    className="relative mx-auto size-5 md:hidden"
                    strokeWidth={2}
                  />
                </Button>
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  );
});

export default function CallToAction() {
  const { user, isLoaded } = useAppUser();

  return (
    <section id="support" className="py-16 md:py-32 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-5xl px-6">
        <CTAContent user={user} isLoaded={isLoaded} />
      </div>
    </section>
  );
}
