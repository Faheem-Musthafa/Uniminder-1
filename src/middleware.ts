import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// DEVELOPMENT MODE: Simplified middleware to fix onboarding loop
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Only protect dashboard routes, let onboarding handle its own logic
  if (isProtectedRoute(req)) {
    await auth.protect(); // Just ensure user is authenticated
    
    // Let the dashboard pages handle the onboarding check themselves
    // This prevents middleware redirect loops
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
