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
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("id,onboarded")
          .eq("id", userId)
          .single();

        // If profile doesn't exist or onboarding not completed, redirect to onboarding
        if (error || !profile || profile.onboarded !== true) {
          console.log("Middleware: Redirecting to onboarding", { 
            hasProfile: !!profile, 
            onboarded: profile?.onboarded,
            error: error?.message 
          });
          return Response.redirect(new URL("/onboarding", req.url));
        }
        
        console.log("Middleware: User is onboarded, allowing dashboard access");
      } catch (error) {
        console.error("Middleware database error:", error);
        // On DB error, redirect to onboarding to be safe
        return Response.redirect(new URL("/onboarding", req.url));
      }
    }
    
    // If user is on onboarding page but already onboarded, redirect to dashboard
    if (userId && req.nextUrl.pathname.startsWith("/onboarding")) {
      try {
        const supabase = createEdgeSupabaseClient();
        const { data: profile } = await supabase
          .from("profiles")
          .select("id,onboarded,role")
          .eq("id", userId)
          .single();

        if (profile && profile.onboarded === true) {
          // User is already onboarded, redirect to appropriate dashboard
          const dashboardPath = profile.role === 'student' ? '/dashboard/student' :
                               profile.role === 'alumni' ? '/dashboard/alumni' :
                               profile.role === 'aspirant' ? '/dashboard/aspirant' :
                               '/dashboard';
          console.log("Middleware: User already onboarded, redirecting to", dashboardPath);
          return Response.redirect(new URL(dashboardPath, req.url));
        }
      } catch (error) {
        console.error("Middleware onboarding check error:", error);
        // On error, allow onboarding to proceed
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
