import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { createEdgeSupabaseClient } from "@/lib/supabase-edge";

// DEVELOPMENT MODE: Temporarily disable dashboard protection
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)", // Commented out for development
  "/onboarding(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId } = await auth.protect(); // ✅ Protect the route first

    if (userId && req.nextUrl.pathname.startsWith("/dashboard")) {
      try {
        // Check if user has completed onboarding using edge-compatible client
        const supabase = createEdgeSupabaseClient();
        const { data: profile } = await supabase
          .from("profiles")
          .select("id,onboarded")
          .eq("id", userId)
          .single();

        if (!profile || profile.onboarded === false) {
          // User not onboarded → redirect to onboarding
          return Response.redirect(new URL("/onboarding", req.url));
        }
      } catch (error) {
        console.error("Middleware database error:", error);
        // On DB error, allow through but log it
      }
    }
  }
});
export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
