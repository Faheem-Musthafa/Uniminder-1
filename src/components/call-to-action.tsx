"use client";

import { Button } from "@/components/ui/button";
import { Mail, SendHorizonal } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function CallToAction() {
  const { user, isLoaded } = useUser();

  return (
    <section id="support" className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          {isLoaded && user ? (
            // Signed in user
            <>
              <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
                Ready to Connect?
              </h2>
              <p className="mt-4">
                Your profile is set up! Start building your network and find mentors.
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
      </div>
    </section>
  );
}
