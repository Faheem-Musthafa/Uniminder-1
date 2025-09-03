// src/app/dashboard/page.tsx
import { SignOutButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export default async function Dashboard() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  return (
    <div>
      Welcome to your Dashboard, user ID: {userId}
      <SignOutButton />
    </div>
  );
}
