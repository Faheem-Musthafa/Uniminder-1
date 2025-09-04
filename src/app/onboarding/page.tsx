"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function Onboarding() {
  const { user } = useUser();
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`Failed to save onboarding: ${data.error}`);
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      alert("Something went wrong.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-xl font-bold mb-4">
        Welcome {user?.firstName}, complete your onboarding
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-64">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select your role</option>
          <option value="student">Student</option>
          <option value="alumni">Alumni</option>
          <option value="aspirant">Aspirant</option>
        </select>

        <button
          type="submit"
          disabled={!role || loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </form>
    </div>
  );
}
