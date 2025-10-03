import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * Routes that require authentication
 * Dashboard pages handle their own onboarding checks to prevent redirect loops
 */
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/posts(.*)",
  "/messages(.*)",
  "/calendar(.*)",
  "/feedback(.*)",
  "/profile(.*)",
]);

/**
 * Public routes that should bypass authentication
 */
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/clerk-webhook(.*)",
  "/api/health(.*)",
]);

/**
 * Middleware to protect routes and handle authentication
 * Simplified to prevent onboarding redirect loops
 */
export default clerkMiddleware(async (auth, req) => {
  // Skip authentication for public routes
  if (isPublicRoute(req)) {
    return;
  }

  // Protect authenticated routes
  if (isProtectedRoute(req)) {
    try {
      await auth.protect();
    } catch (error) {
      console.error("[Middleware] Authentication error:", error);
      // Clerk will handle the redirect to sign-in
      throw error;
    }
  }
});

/**
 * Middleware configuration
 * Matches all routes except static files and Next.js internals
 */
export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
