import CallToAction from "@/components/call-to-action";
import FAQsThree from "@/components/faqs-3";
import FeaturesSection from "@/components/features-8";
import FooterSection from "@/components/footer";
import Hero from "@/components/hero";
import NavBar from "@/components/navbar";

// Force dynamic rendering to avoid build-time Clerk issues
export const dynamic = 'force-dynamic';

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
      <FAQsThree />
      <CallToAction />
      <FooterSection />
    </div>
  );
}
