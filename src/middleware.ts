// src/middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

// 👇 Configure which routes require auth
export const config = {
  matcher: [
    // protect all routes under /dashboard and /chat
    "/dashboard(.*)",
    "/chat(.*)",
  ],
};
