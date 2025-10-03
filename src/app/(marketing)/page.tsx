import { Metadata } from 'next';
import CallToAction from "@/components/call-to-action";
import FAQsThree from "@/components/faqs-3";
import FeaturesSection from "@/components/features-8";
import FooterSection from "@/components/footer";
import Hero from "@/components/hero";
import NavBar from "@/components/navbar";

export const metadata: Metadata = {
  title: 'UniMinder - Connect, Learn, Grow',
  description: 'UniMinder is a mentorship and career guidance platform connecting students, alumni, and aspirants. Find mentors, share job referrals, and build meaningful connections in your college network.',
  keywords: ['mentorship', 'college network', 'career guidance', 'alumni network', 'student platform', 'job referrals'],
  openGraph: {
    title: 'UniMinder - Connect, Learn, Grow',
    description: 'Transform your academic journey into career success with UniMinder.',
    type: 'website',
  },
};

/**
 * Landing page component showcasing UniMinder's features and benefits
 * Server component for optimal performance and SEO
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <NavBar />
      <Hero />
      <FeaturesSection />
      <FAQsThree />
      <CallToAction />
      <FooterSection />
    </div>
  );
}
