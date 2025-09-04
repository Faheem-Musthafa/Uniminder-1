"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Onboarding() {
  const { user } = useUser();
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit() {
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error("Onboarding failed:", body);
        alert("Failed to save onboarding. Please try again.");
        setLoading(false);
        return;
      }

      // redirect client-side for a smoother navigation
      router.push("/dashboard");
    } catch (err) {
      console.error("Onboarding error:", err);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-xl font-bold mb-4">
        Welcome {user?.firstName}, complete your onboarding
      </h1>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="border p-2 rounded mb-4"
      >
        <option value="">Select your role</option>
        <option value="student">Student</option>
        <option value="alumni">Alumni</option>
        <option value="aspirant">Aspirant</option>
      </select>
      <button
        onClick={handleSubmit}
        disabled={!role || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Saving..." : "Continue"}
      </button>
    </div>
  );
}
