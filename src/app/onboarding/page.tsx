"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function Onboarding() {
  const { user } = useUser();
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    window.location.href = "/dashboard";
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
