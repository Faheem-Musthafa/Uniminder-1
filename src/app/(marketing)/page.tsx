import { Button } from "@/components/ui/button";
import { getSupabase } from "@/lib/supabase";
import Link from "next/link";

export default async function LandingPage() {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("profiles").select("*");

  console.log("Profiles:", data, error);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="flex justify-between item-center px-8 py-4 shadow-sm">
        <h1 className="text-2xl font-bold ">Uniminder</h1>
        <nav className="flex gap-4">
          <Link href="/sign-in">
            <Button variant="outline">Sign In</Button>
          </Link>
          <Link href="/sign-up">
            <Button>Get Started</Button>
          </Link>
        </nav>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center text-center px-6">
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
          Connect Students, Alumni & Aspirants
        </h2>
        <p className="text-2xl text-gray-500 max-w-2xl mb-6">
          UniMinder helps you find mentors, share job referrals, and build
          meaningful connections in your college network.
        </p>
        <Link href="/sign-up">
          <Button size="lg" className="px-8 py-4 text-lg">
            Join Now
          </Button>
        </Link>
      </main>
    </div>
  );
}
