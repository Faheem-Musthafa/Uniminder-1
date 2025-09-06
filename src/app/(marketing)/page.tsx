import FeaturesSection from "@/components/features-8";
import Hero from "@/components/hero";
import NavBar from "@/components/navbar";

export default async function LandingPage() {
  // const supabase = getSupabase();
  // const { data, error } = await supabase.from("profiles").select("*");

  // console.log("Profiles:", data, error);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <NavBar />
      <Hero />
      <FeaturesSection />
    </div>
  );
}
