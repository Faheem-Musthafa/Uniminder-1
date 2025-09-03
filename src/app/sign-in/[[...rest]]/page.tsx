// src/app/sign-in/[[...rest]]/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <SignIn
        routing="path"
        path="/sign-in"
        afterSignInUrl="/dashboard" // 👈 redirect here
        afterSignUpUrl="/dashboard" // 👈 also works for sign-up flow
      />
    </div>
  );
}
