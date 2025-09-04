"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Onboarding() {
  const { user } = useUser();
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [roles, setRoles] = useState<{ id: string; label: string }[]>([]);

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

      const body = await res.json().catch(() => ({}));
      console.log("Onboarding success response:", body);

      // redirect client-side for a smoother navigation
      router.push("/dashboard");
    } catch (err) {
      console.error("Onboarding error:", err);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/roles");
        if (!res.ok) throw new Error("Failed to fetch roles");
        const body = await res.json();
        if (mounted) setRoles(body.roles || []);
      } catch (err) {
        console.error("Failed to load roles", err);
        // fallback
        if (mounted)
          setRoles([
            { id: "student", label: "Student" },
            { id: "alumni", label: "Alumni" },
            { id: "aspirant", label: "Aspirant" },
          ]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

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
        {roles.map((r) => (
          <option key={r.id} value={r.id}>
            {r.label}
          </option>
        ))}
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
