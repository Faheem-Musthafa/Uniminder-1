import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { UserProvider } from "@/components/providers/user-provider";

export const metadata: Metadata = {
  title: {
    default: "UniMinder - College Mentorship & Career Platform",
    template: "%s | UniMinder",
  },
  description: "Connect with alumni mentors, discover job opportunities, and build your professional network. UniMinder empowers students, alumni, and aspirants to achieve career success.",
  keywords: [
    "mentorship platform",
    "college network",
    "alumni connection",
    "career guidance",
    "job referrals",
    "student networking",
    "professional development",
  ],
  authors: [{ name: "UniMinder Team" }],
  creator: "UniMinder",
  publisher: "UniMinder",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "UniMinder",
    title: "UniMinder - College Mentorship & Career Platform",
    description: "Connect with alumni mentors and discover career opportunities.",
  },
  twitter: {
    card: "summary_large_image",
    title: "UniMinder - College Mentorship Platform",
    description: "Connect, learn, and grow with UniMinder.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * Root layout component that wraps the entire application
 * Provides authentication, theming, and analytics capabilities
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ClerkProvider
      appearance={
        {
          baseTheme: undefined,
          variables: {
            colorPrimary: "hsl(221.2 83.2% 53.3%)",
          },
        }
      }
    >
      <html lang="en" suppressHydrationWarning>
        <body className="antialiased">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <UserProvider>{children}</UserProvider>
            <SpeedInsights />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
