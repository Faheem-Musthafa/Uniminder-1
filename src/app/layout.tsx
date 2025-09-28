// src/app/layout.tsx
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { UserProvider } from "@/components/providers/user-provider";

export const metadata: Metadata = {
  title: "UniMinder",
  description: "Mentorship & Career Guidance Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
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
